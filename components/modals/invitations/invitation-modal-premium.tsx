import React from "react";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { formatDate } from "@/lib/utils/formatted-date";
import Image from "@/components/ui/image";
import { Guest, Invitation } from "@/types";

interface InvitationModalProps {
  invitation: Invitation & { currentGuest: Guest };
  isOpen: boolean;
  onClose: () => void;
  variant?: "001";
}

const InvitationModalPremium: React.FC<InvitationModalProps> = ({
  invitation,
  isOpen,
  onClose,
  variant = "001",
}) => {
  const bgImage =
    variant === "001" ? "/assets/themes/premium-001/img/bg-001.jpg" : "";

  const dateParts = formatDate(invitation.date, "EEEE dd MMMM yyyy").split(" ");

  return (
    <div
      className={clsx(
        "fixed z-50 md:p-10 inset-0 bg-slate-50 bg-cover bg-center transition-all duration-1000 ease-in-out transform",
        {
          "translate-y-0 opacity-100": isOpen,
          "-translate-y-full opacity-0 pointer-events-none": !isOpen,
        }
      )}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="flex flex-col items-center justify-center h-full gap-3"
        data-aos="zoom-in"
        data-aos-delay="500"
      >
        {/* ====== Start Premium 001 ======*/}
        {variant === "001" ? (
          <>
            <Image
              src={invitation.image}
              alt="Foto"
              aspectRatio="aspect-square"
              className="w-5/12 md:w-2/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
              priority
            />
            <h1>The Wedding Of</h1>
            <div className="font-alex text-5xl text-green-primary">
              {invitation.groom} & {invitation.bride}
            </div>
            <div className="grid grid-cols-3 items-center gap-3 my-6 md:my-0">
              <div className="justify-self-end">{dateParts[0] ?? "-"}</div>
              <div className="justify-self-center text-3xl font-medium border-r-2 border-l-2 text-green-primary border-green-primary px-3">
                {dateParts[1] ?? "-"}
              </div>
              <div className="justify-self-start">{dateParts[2] ?? "-"}</div>
              <div className="col-span-3 text-center text-lg">
                {dateParts[3] ?? "-"}
              </div>
            </div>
            <div className="text-center mb-8">
              <div>Kepada:</div>
              <div>Yth. Bapak/Ibu/Saudara/i</div>
              <div className="font-bold">{invitation.currentGuest.name}</div>
              <div>{invitation.currentGuest.address}</div>
            </div>
            <Button
              variant="default"
              onClick={onClose}
              className="bg-green-primary hover:bg-green-secondary text-white"
            >
              <MailOpen /> Buka Undangan
            </Button>
          </>
        ) : null}
      </div>
      {/* ====== End Premium 001 ======*/}
    </div>
  );
};

export default InvitationModalPremium;
