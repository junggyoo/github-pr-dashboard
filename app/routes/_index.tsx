import { useState } from "react";
import { Octokit } from "@octokit/rest";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import Filter from "~/components/Filter";
import PRListSection from "~/components/PRListSection";

import { PRStatus } from "~/types";
import { getSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "PR Dashboard" },
		{ name: "description", content: "Github PR Dashboard" },
	];
};

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request);
	const token = session.get("token");
	const url = new URL(request.url);
	const prStatus = url.searchParams.get("prStatus") || "all";

	if (!token) {
		return redirect("/auth/github");
	}

	const octokit = new Octokit({
		auth: token,
	});

	const getQueryString = (baseQuery: string) => {
		switch (prStatus) {
			case "before":
				return `${baseQuery} review:none`; // 리뷰가 없는 PR
			case "pending":
				return `${baseQuery} review:required`; // 리뷰가 필요한 PR
			case "completed":
				return `${baseQuery} review:approved`; // 승인된 PR
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

	return { prList: uniqueItems, prStatus };
};

export default function Index() {
	const navigate = useNavigate();
	const navigation = useNavigation();
	const { prList, prStatus: initialStatus } = useLoaderData<typeof loader>();
	const [prStatus, setPrStatus] = useState<PRStatus>(initialStatus);

	const handleStatusChange = (prStatus: PRStatus) => {
		setPrStatus(prStatus);
		navigate(`?prStatus=${prStatus}`);
	};

	const isLoading = navigation.state === "loading";

	return (
		<div className="flex flex-col gap-[32px]">
			<section>대쉬보드 영역</section>
			<Filter prStatus={prStatus} onStatusChange={handleStatusChange} />
			<section>검색 및 필터 영역</section>
			{isLoading ? <div>Loading...</div> : <PRListSection prList={prList} />}
		</div>
	);
}
