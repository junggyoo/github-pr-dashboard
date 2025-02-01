import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "~/components/ui/select";

export default function Filter() {
  const [reviewStatus, setReviewStatus] = useState("all");

  return (
    <div className="h-10 flex items-center justify-end">
      <Select onValueChange={setReviewStatus} defaultValue={reviewStatus}>
        <SelectTrigger className="w-[190px] bg-white">
          <SelectValue placeholder="리뷰 상태를 선택해주세요." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>리뷰 상태</SelectLabel>
            <SelectItem value="all">모든 리뷰</SelectItem>
            <SelectItem value="before">시작 전</SelectItem>
            <SelectItem value="pending">진행 중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
