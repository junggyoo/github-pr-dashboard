export type PRStatus = "all" | "changes" | "approved" | "pending" | "commented";

export type PRReviewStatus =
  | "BEFORE"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "COMMENTED"
  | "PENDING"
  | "DISMISSED"
  | "ALL"
  | null;

export interface PRListDto {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  repository_url: string;
  myReviewState: PRReviewStatus;
}
