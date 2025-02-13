import { createCookieSessionStorage, redirect } from "@remix-run/node";

// 세션 스토리지 설정
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__github_session", // 쿠키 이름
    httpOnly: true, // 브라우저 JS에서 접근 불가
    path: "/", // 모든 경로에서 사용 가능
    sameSite: "lax", // CSRF 보호
    secrets: [process.env.SESSION_SECRET || "default-secret"], // 세션 암호화 키
    secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
  },
});

// 세션 가져오기
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// 로그인 세션 생성
export async function createUserSession(
  accessToken: string,
  redirectTo: string
) {
  const session = await sessionStorage.getSession();
  session.set("token", accessToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// 로그아웃
export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// 로그인 필요한 페이지에서 사용할 토큰 가져오기
export async function requireToken(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getSession(request);
  const token = session.get("token");

  if (!token) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/github?${searchParams}`);
  }

  return token;
}
