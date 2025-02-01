import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

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
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: PRListDto[];
}

const getOctokit = (token: string) =>
  new Octokit({
    auth: token,
  });

const fetchPullRequests = async (
  token?: string
): Promise<GitHubSearchResponse | null> => {
  if (!token) return null;

  const octokit = getOctokit(token);

  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open assignee:@me -author:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  return data as GitHubSearchResponse;
};

export const usePullRequests = (token?: string) => {
  const [prList, setPrList] = useState<PRListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updatePrList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPullRequests(token);
      setPrList(data?.items || []);
    } catch (error) {
      console.error("Error fetching pull requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      updatePrList();
    }
  }, [token]);

  return { prList, isLoading };
};
