import { cn } from "~/lib/utils";

interface RowProps {
  pr: any;
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
            <span>{pr.repository.full_name}</span>
            <span>{pr.created_at}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-[8px]">
        <Badge label="Pending" />
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
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-[8px] text-[10px] text-gray-500">
      {label}
    </div>
  );
};
