import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { getSession } from "shared/lib/session-server";
import { PullRequestService } from "./service";
import { createGitHubClient } from "../model";

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request);
	const token = session.get("token");

	if (!token) {
		return redirect("/auth/github");
	}

	try {
		const githubClient = await createGitHubClient(token).initialize();
		const prService = new PullRequestService(githubClient);

		const [prList, summary] = await Promise.all([
			prService.getPRList(),
			prService.getPRSummary(),
		]);

		return {
			prList,
			...summary,
		};
	} catch (error) {
		console.error("Failed to load pull requests:", error);
		throw new Response("Failed to load pull requests", { status: 500 });
	}
};
