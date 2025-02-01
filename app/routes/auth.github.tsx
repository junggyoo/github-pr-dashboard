import { redirect } from "@remix-run/node";
import { getBaseUrl } from "~/utils/env";

export async function loader() {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const scope = "repo user"; // 필요한 권한 스코프

	const baseUrl = getBaseUrl();
	const redirectUri = `${baseUrl}/auth/github/callback`;

	return redirect(
		`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}`
	);
}
