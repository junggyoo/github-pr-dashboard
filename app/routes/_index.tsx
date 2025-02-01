import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Filter from "~/components/Filter";
import PRListSection from "~/components/PRListSection";
import { usePullRequests } from "~/service/usePullRequests";
import { getSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("token");

  if (!token) {
    return redirect("/auth/github");
  }

  return { token };
};

export default function Index() {
  const { token } = useLoaderData<typeof loader>();
  const { prList } = usePullRequests(token);

  console.log("prList", prList);

  return (
    <div className="flex flex-col gap-[32px]">
      <section>대쉬보드 영역</section>
      <Filter />
      <section>검색 및 필터 영역</section>
      <PRListSection prList={prList} />
    </div>
  );
}
