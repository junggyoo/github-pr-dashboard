import { useEffect, useState } from "react";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import Filter from "~/components/Filter";
import PRListSection from "~/components/PRListSection";
import { PRReviewStatus, PRListDto } from "~/types";
import { getSession } from "~/utils/session.server";
import { getPullRequests } from "~/services/github.server";

export const meta: MetaFunction = () => {
  return [
    { title: "PR Dashboard" },
    { name: "description", content: "Github PR Dashboard" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("token");

  if (!token) {
    return redirect("/auth/github");
  }

  const { prList, assignedPRCount, totalPRCount } = await getPullRequests(
    token
  );

  return {
    prList,
    나에게_할당된_PR_개수: assignedPRCount,
    총_PR_개수: totalPRCount,
  };
};

export default function Index() {
  const navigation = useNavigation();
  const { prList, 나에게_할당된_PR_개수, 총_PR_개수 } =
    useLoaderData<typeof loader>();
  const [prStatus, setPrStatus] = useState<PRReviewStatus>("ALL");
  const [clientPrList, setClientPrList] = useState<PRListDto[]>([]);

  const handleStatusChange = (prStatus: PRReviewStatus) => {
    setPrStatus(prStatus);
    if (prStatus === "ALL") {
      setClientPrList(prList);
    } else {
      setClientPrList(
        prList.filter((pr: PRListDto) => pr.myReviewState === prStatus)
      );
    }
  };

  const isLoading = navigation.state === "loading";

  useEffect(() => {
    setClientPrList(prList);
  }, [prList]);

  return (
    <div className="flex flex-col gap-[32px]">
      <section className="flex gap-5">
        <div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="mb-6 text-sm font-medium text-gray-500">
            🚨 나의 승인이 필요한 PR
          </div>
          <div className="text-2xl font-semibold">
            {나에게_할당된_PR_개수}개
          </div>
        </div>
        <div className="flex-1 rounded-2xl bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="mb-6 text-sm font-medium text-gray-500">
            🔥 내가 리뷰해야 할 PR
          </div>
          <div className="text-2xl font-semibold">{총_PR_개수}개</div>
        </div>
      </section>
      <Filter prStatus={prStatus} onStatusChange={handleStatusChange} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PRListSection prList={clientPrList} />
      )}
    </div>
  );
}
