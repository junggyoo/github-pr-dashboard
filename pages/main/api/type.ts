import type { PRListDto, PRReviewStatus } from "../types";

export interface PRSummary {
	prList: PRListDto[];
	assignedPRCount: number;
	totalPRCount: number;
}

export interface PRSearchOptions {
	sort?: "updated" | "created" | "comments";
	order?: "desc" | "asc";
	perPage?: number;
}

export interface PRReviewInfo {
	myReviewState: PRReviewStatus;
	myLatestReviewSubmittedAt: string | null;
}
