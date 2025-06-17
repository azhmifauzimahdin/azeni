import { Invitation } from "@/types";
import InvitationCard from "./invitation-card";

interface InvitationListProps {
  invitations: Invitation[];
  isFetching: boolean;
}

function InvitationCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 space-y-5">
      <div className="flex gap-3">
        <div className="bg-skeleton rounded aspect-square w-16 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-skeleton rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-skeleton rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-skeleton rounded animate-pulse"></div>
        <div className="h-10 bg-skeleton rounded animate-pulse"></div>
      </div>
    </div>
  );
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isFetching,
}) => {
  if (isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((_, i) => (
          <InvitationCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {invitations.map((data) => (
        <InvitationCard key={data.id} data={data} />
      ))}
    </div>
  );
};

export default InvitationList;
