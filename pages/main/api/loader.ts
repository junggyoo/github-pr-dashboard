import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { getSession } from "shared/lib/session-server";
import { getPullRequests } from "./github-server";

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request);
	const token = session.get("token");

	if (!token) {
		return redirect("/auth/github");
	}

	const { prList, assignedPRCount, totalPRCount } = await getPullRequests(
		token
	);

	return {
		prList,
		나에게_할당된_PR_개수: assignedPRCount,
		총_PR_개수: totalPRCount,
	};
};
