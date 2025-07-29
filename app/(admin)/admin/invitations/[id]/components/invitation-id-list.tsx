import InvitationIdCard, {
  InvitationIdCardSkeleton,
} from "./invitation-id-card";

interface InvitationIdListProps {
  sections: {
    id: string;
    label: string;
    icon: string;
    href: string;
  }[];
  isFetching?: boolean;
}

const InvitationIdList: React.FC<InvitationIdListProps> = ({
  sections,
  isFetching,
}) => {
  if (isFetching) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        {[...Array(sections.length || 12)].map((_, i) => (
          <InvitationIdCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
      {sections.map((data) => (
        <InvitationIdCard key={data.id} data={data} />
      ))}
    </div>
  );
};

export default InvitationIdList;
