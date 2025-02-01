import { PRListDto } from "~/types";
import Row from "./Row";

interface PRListSectionProps {
  prList: PRListDto[];
}

export default function PRListSection({ prList }: PRListSectionProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      {prList.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          해당 데이터는 존재하지 않습니다.
        </div>
      ) : (
        prList.map((pr) => <Row pr={pr} key={pr.id} />)
      )}
    </div>
  );
}
