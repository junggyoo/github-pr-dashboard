import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

const getOctokit = (token: string) =>
  new Octokit({
    auth: token,
  });

const fetchPullRequests = async (token?: string) => {
  if (!token) return [];

  const octokit = getOctokit(token);

  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open review-requested:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  return data;
};

export const usePullRequests = (token?: string) => {
  const [prList, setPrList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updatePrList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPullRequests(token);
      console.log("data", data);
      setPrList(data.items);
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
