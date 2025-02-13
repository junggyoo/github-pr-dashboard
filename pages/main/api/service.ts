import type { Octokit } from "@octokit/rest";

import type { GitHubClient } from "../model/github-client";
import type { PRSummary, PRSearchOptions, PRReviewInfo } from "./type";

import type { PRListDto, PRReviewStatus } from "../types";

export class PullRequestService {
	private client: Octokit;
	private username: string;

	constructor(githubClient: GitHubClient) {
		this.client = githubClient.getClient();
		this.username = githubClient.getUsername();
	}

	private async searchPullRequests(
		query: string,
		options: PRSearchOptions = {}
	) {
		const { sort = "updated", order = "desc", perPage = 100 } = options;

		return this.client.rest.search.issuesAndPullRequests({
			q: query,
			sort,
			order,
			per_page: perPage,
		});
	}

	private async getReviewInfo(
		owner: string,
		repo: string,
		pullNumber: number
	): Promise<PRReviewInfo> {
		const reviews = await this.client.rest.pulls.listReviews({
			owner,
			repo,
			pull_number: pullNumber,
		});

		const myReviews = reviews.data.filter(
			(review) => review.user?.login === this.username
		);
		const latestReview = myReviews[myReviews.length - 1];

		return {
			myReviewState: latestReview?.state as PRReviewStatus,
			myLatestReviewSubmittedAt: latestReview?.submitted_at ?? null,
		};
	}

	async getPRSummary(): Promise<
		Pick<PRSummary, "assignedPRCount" | "totalPRCount">
	> {
		const [assigned, reviewRequested] = await Promise.all([
			this.searchPullRequests("is:pr is:open assignee:@me"),
			this.searchPullRequests("is:pr is:open review-requested:@me"),
		]);

		const uniqueItems = this.removeDuplicates([
			...reviewRequested.data.items,
			...assigned.data.items,
		]);

		return {
			assignedPRCount: assigned.data.total_count,
			totalPRCount: uniqueItems.length,
		};
	}

	async getPRList(): Promise<PRListDto[]> {
		const [assigned, reviewRequested] = await Promise.all([
			this.searchPullRequests("is:pr is:open assignee:@me"),
			this.searchPullRequests("is:pr is:open review-requested:@me"),
		]);

		const uniqueItems = this.removeDuplicates([
			...reviewRequested.data.items,
			...assigned.data.items,
		]);

		return Promise.all(
			uniqueItems.map(async (item) => {
				const [owner, repo] = item.repository_url.split("/").slice(-2);
				const reviewInfo = await this.getReviewInfo(owner, repo, item.number);

				return {
					...item,
					...reviewInfo,
				} as PRListDto;
			})
		);
	}

	private removeDuplicates<T extends { id: number }>(items: T[]): T[] {
		return Array.from(new Map(items.map((item) => [item.id, item])).values());
	}
}
