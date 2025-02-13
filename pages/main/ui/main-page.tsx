import { useEffect } from "react";
import { useLoaderData, useNavigation } from "@remix-run/react";

import { Filter } from "./filter";
import { PRList } from "./pr-list";
import { PRSummary } from "./pr-summary";

import { usePRStore } from "../model/pr-store";
import type { loader } from "../api";

export function MainPage() {
	const navigation = useNavigation();
	const { prList, assignedPRCount, totalPRCount } =
		useLoaderData<typeof loader>();
	const { setPRList, setStats } = usePRStore();

	useEffect(() => {
		setPRList(prList);
		setStats({ assignedPRCount, totalPRCount });
	}, [prList, assignedPRCount, totalPRCount, setPRList, setStats]);

	return (
		<div className="flex flex-col gap-[32px]">
			<PRSummary />
			<Filter />
			{navigation.state === "loading" ? <div>Loading...</div> : <PRList />}
		</div>
	);
}
