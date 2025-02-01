import Row from "./Row";

interface PRListSectionProps {
  prList: any[];
}

export default function PRListSection({ prList }: PRListSectionProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      {prList.map((pr) => (
        <Row pr={pr} key={pr.id} />
      ))}
    </div>
  );
}
