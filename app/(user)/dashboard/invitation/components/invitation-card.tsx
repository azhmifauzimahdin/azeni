import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import StatusBadge from "@/components/ui/status-badge";
import { mapStatusNameToStatusCode } from "@/lib/utils/status-code-map";
import { Invitation } from "@/types";
import { Mail, Link2, Settings, ArrowRightCircle, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface InvitationCardProps {
  data: Invitation;
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
          {data.transaction?.status?.name && (
            <StatusBadge statusName={data.transaction?.status?.name} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.transaction?.status?.name === "SUCCESS" ? (
          <LinkButton
            href={`/dashboard/invitation/${data.id}`}
            variant="primary"
          >
            <Settings size={20} />
            Kelola
          </LinkButton>
        ) : null}
        {data.transaction?.status?.name === "SUCCESS" ? (
          <Button
            type="button"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_BASE_URL}/${data.slug}/${
                  data?.guests[data?.guests.length - 1].code
                }`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            variant="outline"
          >
            <Link2 size={20} />
            Undangan
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (data.transaction?.status?.name) {
                if (data.transaction?.status?.name === "CREATED")
                  router.push(`invitation/new/${data.id}/checkout`);
                else
                  router.push(
                    `invitation/new/${data.id}/payment?order_id=${
                      data.transaction.orderId
                    }&status_code=${mapStatusNameToStatusCode(
                      data.transaction?.status?.name
                    )}&transaction_status=${data.transaction?.status?.name.toLowerCase()}`
                  );
              }
            }}
            type="button"
            className="order-2"
            variant="outline"
          >
            {["CANCELLED", "EXPIRED"].includes(
              data.transaction?.status?.name ?? ""
            ) ? (
              <>
                <Wallet /> Detail
              </>
            ) : (
              <>
                <ArrowRightCircle /> Lanjutkan
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvitationCard;
