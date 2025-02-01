import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Octokit } from "@octokit/rest";
import { getSession } from "~/utils/session.server";
import Filter from "~/components/Filter";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const token = session.get("token");

  console.log("token", token);

  if (!token) {
    return redirect("/auth/github");
  }

  const octokit = new Octokit({
    auth: token,
  });

  return null;
};

export default function Index() {
  return (
    <div className="flex flex-col gap-[32px]">
      <section>대쉬보드 영역</section>
      <Filter />
      <section>PR 목록 영역</section>
    </div>
  );
}
