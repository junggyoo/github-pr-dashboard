import { Octokit } from "@octokit/rest";
import { PRListDto } from "~/service/usePullRequests";
import type { PRReviewStatus } from "~/types";

type PRSummary = {
  prList: PRListDto[];
  assignedPRCount: number;
  totalPRCount: number;
};

async function getPRSummary(octokit: Octokit) {
  // 필터 없이 Assignee로 지정된 전체 PR 검색
  const assigned = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open assignee:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  // 필터 없이 리뷰어로 지정된 전체 PR 검색
  const reviewRequested = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open review-requested:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  // 전체 PR 중복 제거
  const allItems = [...reviewRequested.data.items, ...assigned.data.items];
  const uniqueItems = Array.from(
    new Map(allItems.map((item) => [item.id, item])).values()
  );

  return {
    assignedPRCount: assigned.data.total_count,
    totalPRCount: uniqueItems.length,
  };
}

async function getFilteredPRList(octokit: Octokit, username: string) {
  // 필터링된 PR 목록 가져오기
  const reviewRequested = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open review-requested:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  const assigned = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open assignee:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  const allItems = [...reviewRequested.data.items, ...assigned.data.items];
  const uniqueItems = Array.from(
    new Map(allItems.map((item) => [item.id, item])).values()
  );

  // PR 각각에 대해 리뷰 정보를 가져와서 추가
  const itemsWithReviewInfo = await Promise.all(
    uniqueItems.map(async (item) => {
      const [owner, repo] = item.repository_url.split("/").slice(-2);
      const pullNumber = item.number;

      const reviews = await octokit.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: pullNumber,
      });

      // 현재 사용자의 가장 최근 리뷰 상태 찾기
      const myReviews = reviews.data.filter(
        (review) => review.user?.login === username
      );
      const latestReview =
        myReviews.length > 0 ? myReviews[myReviews.length - 1] : null;

      return {
        ...item,
        myReviewState: latestReview
          ? (latestReview.state as PRReviewStatus)
          : "BEFORE",
        myLatestReviewSubmittedAt: latestReview?.submitted_at || null,
      };
    })
  );

  return itemsWithReviewInfo;
}

export async function getPullRequests(token: string): Promise<PRSummary> {
  const octokit = new Octokit({
    auth: token,
  });

  // 현재 인증된 사용자 정보 가져오기
  const { data: user } = await octokit.rest.users.getAuthenticated();

  // PR 요약 정보는 필터와 무관하게 가져오기
  const summary = await getPRSummary(octokit);
  // 필터링된 PR 목록 가져오기
  const filteredPRList = await getFilteredPRList(octokit, user.login);

  return {
    prList: filteredPRList as PRListDto[],
    assignedPRCount: summary.assignedPRCount,
    totalPRCount: summary.totalPRCount,
  };
}
