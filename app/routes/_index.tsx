import type { MetaFunction } from "@remix-run/node";
import PRListSection from "~/components/PRListSection";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col gap-[32px]">
      <section>대쉬보드 영역</section>
      <section>검색 및 필터 영역</section>
      <PRListSection prList={DUMMY_PR_LIST} />
    </div>
  );
}

const DUMMY_PR_LIST = [
  {
    id: 1,
    number: 2458,
    title: "[FE] Implement PR Review Dashboard",
    html_url: "https://github.com/my-org/project-name/pull/2458",
    state: "open",
    created_at: "2024-03-18T03:24:15Z",
    updated_at: "2024-03-18T09:15:32Z",
    repository: {
      name: "project-name",
      full_name: "my-org/project-name",
      html_url: "https://github.com/my-org/project-name",
    },
    user: {
      login: "안성주",
      avatar_url: "https://avatars.githubusercontent.com/u/12345678",
    },
    labels: [
      { id: 1, name: "frontend", color: "0366d6" },
      { id: 2, name: "in-review", color: "fbca04" },
    ],
    requested_reviewers: [
      {
        login: "김영준",
        avatar_url: "https://avatars.githubusercontent.com/u/23456789",
      },
    ],
  },
  {
    id: 2,
    number: 2457,
    title: "[BE] Add API Rate Limiting",
    html_url: "https://github.com/my-org/backend-service/pull/2457",
    state: "open",
    created_at: "2024-03-17T08:45:00Z",
    updated_at: "2024-03-18T02:30:00Z",
    repository: {
      name: "backend-service",
      full_name: "my-org/backend-service",
      html_url: "https://github.com/my-org/backend-service",
    },
    user: {
      login: "김영준",
      avatar_url: "https://avatars.githubusercontent.com/u/34567890",
    },
    labels: [
      { id: 3, name: "backend", color: "d73a4a" },
      { id: 4, name: "performance", color: "0e8a16" },
    ],
    requested_reviewers: [
      {
        login: "tech-lead",
        avatar_url: "https://avatars.githubusercontent.com/u/45678901",
      },
      {
        login: "security-team",
        avatar_url: "https://avatars.githubusercontent.com/u/56789012",
      },
    ],
  },
  {
    id: 3,
    number: 2456,
    title: "[Infra] Update Kubernetes Configuration",
    html_url: "https://github.com/my-org/infrastructure/pull/2456",
    state: "open",
    created_at: "2024-03-16T15:20:00Z",
    updated_at: "2024-03-17T10:45:00Z",
    repository: {
      name: "infrastructure",
      full_name: "my-org/infrastructure",
      html_url: "https://github.com/my-org/infrastructure",
    },
    user: {
      login: "안성주",
      avatar_url: "https://avatars.githubusercontent.com/u/67890123",
    },
    labels: [
      { id: 5, name: "infrastructure", color: "6f42c1" },
      { id: 6, name: "deployment", color: "1d76db" },
    ],
    requested_reviewers: [
      {
        login: "infra-lead",
        avatar_url: "https://avatars.githubusercontent.com/u/78901234",
      },
    ],
  },
];
