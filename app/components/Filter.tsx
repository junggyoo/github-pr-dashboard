import { PRReviewStatus } from "~/types";

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

export default function Filter({ prStatus, onStatusChange }: FilterProps) {
  return (
    <div className="flex gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onStatusChange(option.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            prStatus === option.value
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
