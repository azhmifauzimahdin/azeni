import { Img } from "@/components/ui/Img";
import Link from "next/link";

export function InvitationIdCardSkeleton() {
  return (
    <div className="aspect-square bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center justify-center animate-pulse">
      <div className="w-1/2 aspect-square bg-gray-300 rounded-md mb-2" />
      <div className="h-4 w-3/4 bg-gray-300 rounded" />
    </div>
  );
}

interface InvitationCardProps {
  data: {
    id: string;
    label: string;
    icon: string;
    href: string;
  };
  isFetching?: boolean;
}

const InvitationIdCard: React.FC<InvitationCardProps> = ({
  data,
  isFetching,
}) => {
  if (isFetching) return <InvitationIdCardSkeleton />;
  return (
    <Link
      key={data.id}
      href={data.href}
      className="relative aspect-square bg-green-app-primary text-white shadow-md rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-green-app-secondary transition-all duration-300 ease-in-out"
    >
      <Img
        src={data.icon}
        alt="Cover"
        sizes="64px"
        wrapperClassName="w-1/2 aspect-square mb-2 rounded"
      />
      <span className="font-semibold tracking-wide group-hover:text-white transition-all duration-300">
        {data.label}
      </span>
    </Link>
  );
};

export default InvitationIdCard;
