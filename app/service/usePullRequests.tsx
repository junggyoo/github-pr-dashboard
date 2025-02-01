import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

export interface PRListDto {
	id: number;
	number: number;
	title: string;
	html_url: string;
	created_at: string;
	user: {
		login: string;
		avatar_url: string;
	};
	repository_url: string;
}

export interface GitHubSearchResponse {
	total_count: number;
	incomplete_results: boolean;
	items: PRListDto[];
}

const getOctokit = (token: string) =>
	new Octokit({
		auth: token,
	});

const fetchPullRequests = async (
	token?: string,
	status: "all" | "before" | "pending" | "completed" = "all"
): Promise<GitHubSearchResponse | null> => {
	if (!token) return null;

	const octokit = getOctokit(token);

	const getQueryString = (baseQuery: string) => {
		switch (status) {
			case "before":
				return `${baseQuery} review:none`;
			case "pending":
				return `${baseQuery} review:required`;
			case "completed":
				return `${baseQuery} review:approved`;
			default:
				return baseQuery;
		}
	};

	// 리뷰어로 지정된 PR 검색
	const reviewRequested = await octokit.rest.search.issuesAndPullRequests({
		q: getQueryString("is:pr is:open review-requested:@me -author:@me"),
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	// Assignee로 지정된 PR 검색
	const assigned = await octokit.rest.search.issuesAndPullRequests({
		q: getQueryString("is:pr is:open assignee:@me -author:@me"),
		sort: "updated",
		order: "desc",
		per_page: 100,
	});

	// 결과 합치기 및 중복 제거
	const allItems = [...reviewRequested.data.items, ...assigned.data.items];
	const uniqueItems = Array.from(
		new Map(allItems.map((item) => [item.id, item])).values()
	);

	return {
		total_count: uniqueItems.length,
		incomplete_results: false,
		items: uniqueItems as PRListDto[],
	};
};

export const usePullRequests = (
	token?: string,
	status: "all" | "before" | "pending" | "completed" = "all"
) => {
	const [prList, setPrList] = useState<PRListDto[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const updatePrList = async () => {
		try {
			setIsLoading(true);
			const data = await fetchPullRequests(token, status);
			setPrList(data?.items || []);
		} catch (error) {
			console.error("Error fetching pull requests", error);
			alert("GitHub API 요청 제한 도달");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			updatePrList();
		}
	}, [token, status]);

	return { prList, isLoading };
};
