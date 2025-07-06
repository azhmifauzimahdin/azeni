import { Invitation } from "@/types";
import InvitationCard from "./invitation-card";
import Image from "@/components/ui/image";

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
      {invitations.length > 0 ? (
        invitations.map((data) => <InvitationCard key={data.id} data={data} />)
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <Image
            src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751777657/invitation-green_xlm6eq.png"
            alt="Icon undangan"
            aspectRatio="aspect-square"
            className="w-20 mb-5"
          />
          <p className="text-sm font-medium">Undangan tidak ditemukan</p>
          <p className="text-xs">Kamu belum membuat undangan pernikahan.</p>
        </div>
      )}
    </div>
  );
};

export default InvitationList;
