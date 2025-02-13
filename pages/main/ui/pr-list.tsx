import { Row } from "./row";
import { PRListDto } from "pages/main/types";
interface PRListProps {
	prList: PRListDto[];
}

export function PRList({ prList }: PRListProps) {
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
