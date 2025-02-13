import { LoaderFunction, redirect } from "@remix-run/node";
import { createUserSession } from "shared/lib/session-server";

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	if (!code) {
		return redirect("/");
	}

	// GitHub access token 받기
	const response = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code,
		}),
	});

	const { access_token } = await response.json();

	// 세션에 토큰 저장
	return createUserSession(access_token, "/");
};
