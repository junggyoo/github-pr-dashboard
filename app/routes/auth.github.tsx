import { redirect } from "@remix-run/node";

export async function loader() {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const scope = "repo user"; // 필요한 권한 스코프

	let DOMAIN = "";

	if (window.location.hostname === "localhost") {
		DOMAIN = "localhost:5173";
	} else {
		DOMAIN = "github-pr-dashboard-eoding.vercel.app";
	}

	return redirect(
		`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
			`https://${DOMAIN}/auth/github/callback`
		)}`
	);
}
