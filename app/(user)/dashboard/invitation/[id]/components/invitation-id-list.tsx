import InvitationIdCard from "./invitation-id-card";

interface InvitationIdListProps {
  sections: {
    id: string;
    label: string;
    icon: string;
    href: string;
  }[];
  isFetching?: boolean;
}

function InvitationIdCardSkeleton() {
  return (
    <div className="aspect-square bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center justify-center text-center animate-pulse">
      <div className="w-1/2 h-1/2 bg-skeleton rounded mb-2" />
      <div className="h-4 w-3/4 bg-skeleton rounded" />
    </div>
  );
}

const InvitationIdList: React.FC<InvitationIdListProps> = ({
  sections,
  isFetching,
}) => {
  if (isFetching) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-8 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
          <InvitationIdCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-8 gap-3">
      {sections.map((data) => (
        <InvitationIdCard key={data.id} data={data} />
      ))}
    </div>
  );
};

export default InvitationIdList;
