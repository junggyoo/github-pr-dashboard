import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

const octokit = new Octokit({
  auth: "",
});

const fetchPullRequests = async () => {
  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: "is:pr is:open review-requested:@me",
    sort: "updated",
    order: "desc",
    per_page: 100,
  });

  return data;
};

export const usePullRequests = () => {
  const [prList, setPrList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updatePrList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPullRequests();
      console.log("data", data);
      setPrList(data.items);
    } catch (error) {
      console.error("Error fetching pull requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePrList();
  }, []);

  return { prList, isLoading };
};
