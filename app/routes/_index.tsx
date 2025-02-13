import type { MetaFunction } from "@remix-run/node";

import { MainPage } from "pages/main";

export { loader } from "pages/main";

export const meta: MetaFunction = () => {
	return [
		{ title: "PR Dashboard" },
		{ name: "description", content: "Github PR Dashboard" },
	];
};

export default MainPage;
