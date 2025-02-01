import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "PR Dashboard" },
		{ name: "description", content: "Github PR Dashboard" },
	];
};

export default function Index() {
	return (
		<div className="flex flex-col gap-[32px] p-6">
			<section className="flex gap-5">
				{/* 나에게 할당된 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">
						나에게 할당된 PR
					</div>
					<div className="text-2xl font-semibold">0개</div>
				</div>

				{/* 총 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">총 PR</div>
					<div className="text-2xl font-semibold">0개</div>
				</div>

				{/* 오늘 완료한 PR */}
				<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
					<div className="mb-6 text-sm font-medium text-gray-500">
						오늘 완료한 PR
					</div>
					<div className="text-2xl font-semibold">0개</div>
				</div>
			</section>

			<section>검색 및 필터 영역</section>
			<section>PR 목록 영역</section>
		</div>
	);
}
