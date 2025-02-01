import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div className="flex flex-col gap-[32px]">
			<section>대쉬보드 영역</section>
			<section>검색 및 필터 영역</section>
			<section>PR 목록 영역</section>
		</div>
	);
}
