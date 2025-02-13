import { Row } from "./row";
import { usePRStore } from "../model/pr-store";

export function PRList() {
	const clientPrList = usePRStore((state) => state.clientPrList);

	return (
		<div className="flex flex-col gap-[8px]">
			{clientPrList.length === 0 ? (
				<div className="text-gray-500 text-center py-4">
					해당 데이터는 존재하지 않습니다.
				</div>
			) : (
				clientPrList.map((pr) => <Row pr={pr} key={pr.id} />)
			)}
		</div>
	);
}
