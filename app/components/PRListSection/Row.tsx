import { cn } from "~/lib/utils";
import { PRListDto } from "~/types";
import { formatDate } from "~/utils/format";

interface RowProps {
  pr: PRListDto;
}

export default function Row({ pr }: RowProps) {
  const handleReviewBtnClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center",
        "bg-white border border-gray-200 rounded-[8px] p-[12px]",
        "hover:bg-gray-100"
      )}
    >
      <div className="flex gap-[8px]">
        <div className="rounded-full overflow-hidden">
          <img
            src={pr.user.avatar_url}
            alt={pr.user.login}
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p>{pr.title}</p>
          <div className="flex gap-[6px] text-[12px] text-gray-500">
            <span>{pr.user.login}</span>
            <span>{pr.repository_url?.split("/repos/")[1] || ""}</span>
            <span>{formatDate(pr.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-[8px]">
        <Badge label={pr.myReviewState || ""} />
        <button
          className="bg-black text-white px-[12px] py-[4px] text-[12px] rounded-[8px] hover:bg-gray-600"
          onClick={() => handleReviewBtnClick(pr.html_url)}
          type="button"
        >
          리뷰하기
        </button>
      </div>
    </div>
  );
}

const Badge = ({ label }: { label: string }) => {
  const getKoreanLabel = (state: string) => {
    switch (state) {
      case "APPROVED":
        return "승인됨";
      case "CHANGES_REQUESTED":
        return "변경 요청";
      case "COMMENTED":
        return "코멘트";
      default:
        return "리뷰 대기중";
    }
  };

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
      default:
        return "bg-purple-100 text-purple-600";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full px-[8px] text-[10px]",
        getBadgeColors(label)
      )}
    >
      {getKoreanLabel(label)}
    </div>
  );
};
