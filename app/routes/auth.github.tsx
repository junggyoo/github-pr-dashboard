import { redirect } from "@remix-run/node";
import { getBaseUrl } from "~/shared/config/env";

export async function loader() {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const scope = "repo user read:org pull_requests";

	const baseUrl = getBaseUrl();
	const redirectUri = `${baseUrl}/auth/github/callback`;

	return redirect(
		`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
	);
}
