import Image from "@/components/ui/image";
import Link from "next/link";

interface InvitationCardProps {
  data: {
    id: string;
    label: string;
    icon: string;
    href: string;
  };
}

const InvitationIdCard: React.FC<InvitationCardProps> = ({ data }) => {
  return (
    <Link
      key={data.id}
      href={data.href}
      className="aspect-square bg-green-app-primary text-white shadow-md rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer group hover:brightness-110 transition-all duration-300 ease-in-out"
    >
      <Image
        src={data.icon}
        alt={`icon ${data.label}`}
        aspectRatio="aspect-square"
        className="w-1/2 mb-2"
      />
      <span className="font-semibold tracking-wide group-hover:text-white transition-all duration-300">
        {data.label}
      </span>
    </Link>
  );
};

export default InvitationIdCard;
