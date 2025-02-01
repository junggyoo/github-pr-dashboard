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
