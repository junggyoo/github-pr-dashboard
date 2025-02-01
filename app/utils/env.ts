export function getBaseUrl() {
	// 서버 사이드에서는 process.env.VERCEL_URL 또는 설정된 BASE_URL을 사용
	if (typeof window === "undefined") {
		if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
		return process.env.BASE_URL || "http://localhost:5173";
	}

	// 클라이언트 사이드에서는 현재 window.location을 기반으로 URL 생성
	const { protocol, host } = window.location;
	return `${protocol}//${host}`;
}
