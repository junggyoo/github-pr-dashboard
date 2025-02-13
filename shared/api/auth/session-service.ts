import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { SessionStorage } from "@remix-run/node";

interface SessionConfig {
	cookieName: string;
	secret: string;
	secure: boolean;
}

export class SessionService {
	private storage: SessionStorage;

	constructor(config: SessionConfig) {
		this.storage = createCookieSessionStorage({
			cookie: {
				name: config.cookieName,
				httpOnly: true,
				path: "/",
				sameSite: "lax",
				secrets: [config.secret],
				secure: config.secure,
			},
		});
	}

	async getSession(request: Request) {
		const cookie = request.headers.get("Cookie");
		return this.storage.getSession(cookie);
	}

	async createUserSession(accessToken: string, redirectTo: string) {
		const session = await this.storage.getSession();
		session.set("token", accessToken);

		return redirect(redirectTo, {
			headers: {
				"Set-Cookie": await this.storage.commitSession(session),
			},
		});
	}

	async logout(request: Request) {
		const session = await this.getSession(request);

		return redirect("/", {
			headers: {
				"Set-Cookie": await this.storage.destroySession(session),
			},
		});
	}

	async requireToken(
		request: Request,
		redirectTo: string = new URL(request.url).pathname
	) {
		const session = await this.getSession(request);
		const token = session.get("token");

		if (!token) {
			const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
			throw redirect(`/auth/github?${searchParams}`);
		}

		return token;
	}
}

// 싱글톤 인스턴스 생성
export const sessionService = new SessionService({
	cookieName: "__github_session",
	secret: process.env.SESSION_SECRET || "default-secret",
	secure: process.env.NODE_ENV === "production",
});
