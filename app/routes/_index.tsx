import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Octokit } from "octokit";

type LoaderData = {
	assignedPRCount: number;
	totalPRCount: number;
	completedTodayCount: number;
};

export const loader: LoaderFunction = async () => {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	try {
		const username = "junggyoo"; // 실제 사용자 이름으로 변경 필요
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// 나에게 할당된 PR 조회
		const assignedPRs = await octokit.request("GET /search/issues", {
			q: `is:pr is:open assignee:${username}`,
			per_page: 100,
		});

		// 나에게 할당되었거나 리뷰어인 PR 조회
		const totalPRs = await octokit.request("GET /search/issues", {
			q: `is:pr is:open assignee:${username} OR review-requested:${username}`,
			per_page: 100,
		});

		// 오늘 완료한 PR 조회
		const completedToday = await octokit.request("GET /search/issues", {
			q: `is:pr is:closed author:${username} closed:>=${
				today.toISOString().split("T")[0]
			}`,
			per_page: 100,
		});

		return json<LoaderData>({
			assignedPRCount: assignedPRs.data.total_count,
			totalPRCount: totalPRs.data.total_count,
			completedTodayCount: completedToday.data.total_count,
		});
	} catch (error) {
		console.error("GitHub API Error:", error);
		return json<LoaderData>({
			assignedPRCount: 0,
			totalPRCount: 0,
			completedTodayCount: 0,
		});
	}
};

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	const { assignedPRCount, totalPRCount, completedTodayCount } =
		useLoaderData<LoaderData>();

	return (
		<div className="flex flex-col gap-[32px] p-6">
			<section className="flex gap-5">
				{/* 나에게 할당된 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">
						나에게 할당된 PR
					</div>
					<div className="text-2xl font-semibold">{assignedPRCount}개</div>
				</div>

				{/* 총 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">총 PR</div>
					<div className="text-2xl font-semibold">{totalPRCount}개</div>
				</div>

				{/* 오늘 완료한 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">
						오늘 완료한 PR
					</div>
					<div className="text-2xl font-semibold">{completedTodayCount}개</div>
				</div>
			</section>

			<section>검색 및 필터 영역</section>
			<section>PR 목록 영역</section>
		</div>
	);
}
