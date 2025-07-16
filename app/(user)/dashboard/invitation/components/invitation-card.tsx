import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import {
  Mail,
  Link2,
  Settings,
  Clock,
  CircleCheck,
  XCircle,
} from "lucide-react";

interface InvitationData {
  id: string;
  groom: string;
  bride: string;
  slug: string;
  image: string;
  transaction: {
    status: {
      name: string;
    };
  };
}

interface InvitationCardProps {
  data: InvitationData;
}

type StatusName = "Menunggu Pembayaran" | "Lunas" | "Batal" | string;

export function StatusBadge({ statusName }: { statusName: StatusName }) {
  const statusVariantMap: Record<
    string,
    "payment" | "destructive" | "fullyPaid" | undefined
  > = {
    "Menunggu Pembayaran": "payment",
    Lunas: "fullyPaid",
    Batal: "destructive",
  };

  const variant = statusVariantMap[statusName] ?? "default";
  const icon =
    statusName === "Menunggu Pembayaran" ? (
      <Clock size={12} />
    ) : statusName === "Lunas" ? (
      <CircleCheck size={12} />
    ) : (
      <XCircle size={12} />
    );

  return (
    <Badge variant={variant} className="gap-2">
      {icon}
      {statusName}
    </Badge>
  );
}

const InvitationCard: React.FC<InvitationCardProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow p-6 space-y-5">
      <div className="flex gap-3">
        {data.image ? (
          <Img
            src={data.image}
            alt="Cover"
            wrapperClassName="w-16 h-16 rounded"
            sizes="64px"
          />
        ) : (
          <div className="bg-gradient-pink-purple rounded w-16 h-16 p-4 text-white">
            <Mail size={32} />
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-green-app-primary tracking-tight">
            {data.groom} & {data.bride}
          </h2>
          <StatusBadge statusName={data.transaction.status.name} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LinkButton href={`/dashboard/invitation/${data.id}`} variant="primary">
          <Settings size={20} />
          Kelola
        </LinkButton>
        {data.transaction.status.name === "Lunas" ? (
          <Button
            type="button"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_BASE_URL}/${data.slug}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            variant="outline"
          >
            <Link2 size={20} />
            Lihat Web
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default InvitationCard;
