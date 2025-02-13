import { usePRStore } from "../model/pr-store";

export function PRSummary() {
	const { assignedPRCount, totalPRCount } = usePRStore();

	return (
		<section className="flex gap-5">
			<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
				<div className="mb-6 text-sm font-medium text-gray-500">
					🚨 나의 승인이 필요한 PR
				</div>
				<div className="text-2xl font-semibold">{assignedPRCount}개</div>
			</div>
			<div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
				<div className="mb-6 text-sm font-medium text-gray-500">
					🔥 내가 리뷰해야 할 PR
				</div>
				<div className="text-2xl font-semibold">{totalPRCount}개</div>
			</div>
		</section>
	);
}
