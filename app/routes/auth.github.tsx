import { redirect } from "@remix-run/node";

export async function loader() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const scope = "repo user"; // 필요한 권한 스코프

  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      "http://localhost:5173/auth/github/callback"
    )}`
  );
}
