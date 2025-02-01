import { Octokit } from "@octokit/rest";
import type { PRStatus } from "~/types";

type PRSummary = {
	prList: any[];
	assignedPRCount: number;
	totalPRCount: number;
};

async function getPRSummary(octokit: Octokit) {
	// 필터 없이 Assignee로 지정된 전체 PR 검색
	const assigned = await octokit.rest.search.issuesAndPullRequests({
		q: "is:pr is:open assignee:@me",
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	// 필터 없이 리뷰어로 지정된 전체 PR 검색
	const reviewRequested = await octokit.rest.search.issuesAndPullRequests({
		q: "is:pr is:open review-requested:@me",
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	// 전체 PR 중복 제거
	const allItems = [...reviewRequested.data.items, ...assigned.data.items];
	const uniqueItems = Array.from(
		new Map(allItems.map((item) => [item.id, item])).values()
	);

	return {
		assignedPRCount: assigned.data.total_count,
		totalPRCount: uniqueItems.length,
	};
}

async function getFilteredPRList(octokit: Octokit, prStatus: PRStatus) {
	const getQueryString = (baseQuery: string) => {
		switch (prStatus) {
			case "pending":
				return `${baseQuery} -review:approved -review:changes_requested -review:commented`; // 리뷰가 없는 PR
			case "changes":
				return `${baseQuery} review:changes_requested`; // 변경 요청된 PR
			case "approved":
				return `${baseQuery} review:approved`; // 승인된 PR
			case "commented":
				return `${baseQuery} review:commented`; // 코멘트만 있는 PR
			default:
				return baseQuery; // 전체 PR
		}
	};

	// 필터링된 PR 목록 가져오기
	const reviewRequested = await octokit.rest.search.issuesAndPullRequests({
		q: getQueryString("is:pr is:open review-requested:@me"),
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	const assigned = await octokit.rest.search.issuesAndPullRequests({
		q: getQueryString("is:pr is:open assignee:@me"),
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	const allItems = [...reviewRequested.data.items, ...assigned.data.items];
	return Array.from(new Map(allItems.map((item) => [item.id, item])).values());
}

export async function getPullRequests(
	token: string,
	prStatus: PRStatus = "all"
): Promise<PRSummary> {
	const octokit = new Octokit({
		auth: token,
	});

	// PR 요약 정보는 필터와 무관하게 가져오기
	const summary = await getPRSummary(octokit);
	// 필터링된 PR 목록 가져오기
	const filteredPRList = await getFilteredPRList(octokit, prStatus);

	return {
		prList: filteredPRList,
		assignedPRCount: summary.assignedPRCount,
		totalPRCount: summary.totalPRCount,
	};
}
