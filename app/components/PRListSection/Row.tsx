import { cn } from "~/lib/utils";

interface RowProps {
  pr: any;
}

export default function Row({ pr }: RowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center",
        "bg-white border border-gray-200 rounded-[8px] p-[12px]"
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
      <div></div>
    </div>
  );
}
