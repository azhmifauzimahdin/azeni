import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import { Invitation } from "@/types";
import {
  Mail,
  Link2,
  Settings,
  Clock,
  CircleCheck,
  XCircle,
  Ban,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface InvitationCardProps {
  data: Invitation;
}

export type StatusName =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

interface StatusBadgeProps {
  statusName: StatusName;
}

export function StatusBadge({ statusName }: StatusBadgeProps) {
  const statusVariantMap: Record<StatusName, BadgeProps["variant"]> = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
  };

  const iconMap: Record<StatusName, React.ReactNode> = {
    PENDING: <Clock size={12} />,
    SUCCESS: <CircleCheck size={12} />,
    FAILED: <XCircle size={12} />,
    CANCELLED: <Ban size={12} />,
    REFUNDED: <RefreshCcw size={12} />,
  };

  const labelMap: Record<StatusName, string> = {
    PENDING: "Menunggu Pembayaran",
    SUCCESS: "Lunas",
    FAILED: "Gagal",
    CANCELLED: "Dibatalkan",
    REFUNDED: "Dikembalikan",
  };

  const variant = statusVariantMap[statusName] ?? "default";
  const icon = iconMap[statusName];
  const label = labelMap[statusName] ?? statusName;

  return (
    <Badge variant={variant} className="gap-2">
      {icon}
      {label}
    </Badge>
  );
}

const InvitationCard: React.FC<InvitationCardProps> = ({ data }) => {
  const router = useRouter();

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
        {data.transaction.status.name === "SUCCESS" ? (
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
        ) : data.transaction.status.name === "PENDING" ? (
          <Button
            type="button"
            onClick={() => router.push("/dashboard/payment")}
            variant="outline"
          >
            <Wallet />
            Bayar
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default InvitationCard;
