import { PRReviewStatus } from "../types";

interface FilterProps {
	prStatus: PRReviewStatus;
	onStatusChange: (status: PRReviewStatus) => void;
}

const FILTER_OPTIONS = [
	{ label: "전체", value: "ALL" },
	{ label: "리뷰 대기중", value: "BEFORE" },
	{ label: "변경 요청", value: "CHANGES_REQUESTED" },
	{ label: "코멘트", value: "COMMENTED" },
	{ label: "승인됨", value: "APPROVED" },
] as const;

export function Filter({ prStatus, onStatusChange }: FilterProps) {
	const getBadgeColors = (state: string) => {
		switch (state) {
			case "APPROVED":
				return "bg-green-100 text-green-600";
			case "CHANGES_REQUESTED":
				return "bg-red-100 text-red-600";
			case "COMMENTED":
				return "bg-blue-100 text-blue-600";
			case "PENDING":
				return "bg-yellow-100 text-yellow-600";
			case "ALL":
				return "bg-gray-300 text-gray-600";
			default:
				return "bg-purple-100 text-purple-600";
		}
	};

	return (
		<div className="flex gap-2">
			{FILTER_OPTIONS.map((option) => (
				<button
					key={option.value}
					onClick={() => onStatusChange(option.value)}
					className={`rounded-full px-4 py-2 text-sm font-medium hover:opacity-70 ${
						prStatus === option.value
							? getBadgeColors(option.value)
							: "bg-gray-100 text-gray-600"
					}`}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
