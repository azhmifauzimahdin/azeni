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
import Premium2Decoration from "@/components/decorations/premium2-decoration";

interface InvitationModalProps {
  invitation: Invitation;
  isOpen: boolean;
  onClose: () => void;
  variant?: "001" | "002";
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
        "fixed md:absolute h-screen-fixed z-50 inset-0 bg-slate-50 transition-all duration-1000 ease-in-out transform",
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
            className="font-alex text-4xl text-green-primary"
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
            <div className="text-xs">{invitation.guest.address}</div>
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
      ) : variant === "002" ? (
        <div className="bg-green-100/15 h-screen p-5 relative">
          {/* DECORATIONS */}
          <Premium2Decoration />
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl gap-3 h-full z-10 relative">
            {/* IMAGE PASANGAN */}
            <Img
              src={
                invitation.image || "/assets/img/aditya-nabila/cover-basic.png"
              }
              alt="Foto"
              wrapperClassName="aspect-[3/4] w-4/12 mb-3 rounded-t-[200px] rounded-b-[200px] border-2 border-[#214d80] shadow-md"
              sizes="300px"
              priority
              data-aos="zoom-in"
            />

            <h1 data-aos="fade-up">The Wedding Of</h1>
            <div
              className="font-playfair text-4xl text-[#214d80]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {invitation.groom} & {invitation.bride}
            </div>

            <div
              className="text-center text-lg"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {formatDate(getEffectiveDate(invitation), "dd")} |&nbsp;
              {formatDate(getEffectiveDate(invitation), "MMMM")} |&nbsp;
              {formatDate(getEffectiveDate(invitation), "yyyy")}
            </div>

            <div
              className="text-center mb-3"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div>Kepada:</div>
              <div>Yth. Bapak/Ibu/Saudara/i</div>
              <div className="font-bold capitalize">
                {invitation.guest.name}
              </div>
              <div className="text-xs">{invitation.guest.address}</div>
            </div>

            <Button
              variant="default"
              onClick={onClose}
              className="bg-[#214d80] hover:bg-[#2a5da0] text-white"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              <MailOpen className="mr-2" /> Buka Undangan
            </Button>
          </div>
        </div>
      ) : null}
      {/* ====== End Premium 001 ======*/}
    </div>
  );
};

export default InvitationModalPremium;
