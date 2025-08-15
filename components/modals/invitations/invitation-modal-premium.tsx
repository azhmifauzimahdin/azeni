"use client";

import React from "react";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { formatDate } from "@/lib/utils/formatted-date";
import { Invitation } from "@/types";
import { Img } from "@/components/ui/Img";
import Premium1Decoration from "@/components/decorations/premium1-decoration";
import { getEffectiveDate } from "@/lib/utils/get-effective-date";

interface InvitationModalProps {
  invitation: Invitation;
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
  const dateParts = formatDate(
    getEffectiveDate(invitation),
    "EEEE dd MMMM yyyy"
  ).split(" ");

  return (
    <div
      className={clsx(
        "fixed md:absolute h-[calc(var(--vh)_*_100)] z-50 inset-0 bg-slate-50 transition-all duration-1000 ease-in-out transform",
        {
          "translate-y-0 opacity-100": isOpen,
          "-translate-y-full opacity-0 pointer-events-none": !isOpen,
        }
      )}
    >
      {/* ====== Start Premium 001 ======*/}
      {variant === "001" ? (
        <div className="bg-green-100/15 relative flex flex-col items-center justify-center h-full gap-3">
          {/* DECORATIONS */}
          <Premium1Decoration />

          {/* IMAGE PASANGAN */}
          <Img
            src={invitation.image}
            alt="Foto"
            wrapperClassName="aspect-square w-4/12 rounded-tr-3xl rounded-br-lg rounded-bl-3xl rounded-tl-lg shadow-md mb-3"
            sizes="300px"
            priority
            data-aos="zoom-in"
          />

          <h1 data-aos="fade-up">The Wedding Of</h1>
          <div
            className="font-alex text-5xl text-green-primary"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {invitation.groom} & {invitation.bride}
          </div>

          <div
            className="grid grid-cols-3 items-center gap-3 my-3"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="justify-self-end">{dateParts[0] ?? "-"}</div>
            <div className="justify-self-center text-3xl font-medium border-r-2 border-l-2 text-green-primary border-green-primary px-3">
              {dateParts[1] ?? "-"}
            </div>
            <div className="justify-self-start">{dateParts[2] ?? "-"}</div>
            <div className="col-span-3 text-center text-lg">
              {dateParts[3] ?? "-"}
            </div>
          </div>

          <div
            className="text-center mb-3"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div>Kepada:</div>
            <div>Yth. Bapak/Ibu/Saudara/i</div>
            <div className="font-bold capitalize">{invitation.guest.name}</div>
            <div>{invitation.guest.address}</div>
          </div>

          <Button
            variant="default"
            onClick={onClose}
            className="bg-green-primary hover:bg-green-secondary text-white"
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <MailOpen className="mr-2" /> Buka Undangan
          </Button>
        </div>
      ) : null}
      {/* ====== End Premium 001 ======*/}
    </div>
  );
};

export default InvitationModalPremium;
