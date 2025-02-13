import { create } from "zustand";
import type { PRReviewStatus, PRListDto } from "../types";

interface PRStore {
	prList: PRListDto[];
	clientPrList: PRListDto[];
	assignedPRCount: number;
	totalPRCount: number;
	prStatus: PRReviewStatus;
	setPRList: (prList: PRListDto[]) => void;
	setPRStatus: (status: PRReviewStatus) => void;
	setStats: (stats: { assignedPRCount: number; totalPRCount: number }) => void;
}

export const usePRStore = create<PRStore>((set) => ({
	prList: [],
	clientPrList: [],
	assignedPRCount: 0,
	totalPRCount: 0,
	prStatus: "ALL",
	setPRList: (prList) => {
		set((state) => ({
			prList,
			clientPrList:
				state.prStatus === "ALL"
					? prList
					: prList.filter((pr) => pr.myReviewState === state.prStatus),
		}));
	},
	setPRStatus: (prStatus) => {
		set((state) => ({
			prStatus,
			clientPrList:
				prStatus === "ALL"
					? state.prList
					: state.prList.filter((pr) => pr.myReviewState === prStatus),
		}));
	},
	setStats: (stats) => set(stats),
}));
