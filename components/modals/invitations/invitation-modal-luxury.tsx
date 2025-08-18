"use client";

import React from "react";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { formatDate } from "@/lib/utils/formatted-date";
import { Invitation } from "@/types";
import { Img } from "@/components/ui/Img";
import { getEffectiveDate } from "@/lib/utils/get-effective-date";

interface InvitationModalProps {
  invitation: Invitation;
  isOpen: boolean;
  onClose: () => void;
  variant?: "001";
}

const InvitationModalLuxury: React.FC<InvitationModalProps> = ({
  invitation,
  isOpen,
  onClose,
  variant = "001",
}) => {
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
      {/* ====== Start Luxury 001 ======*/}
      {variant === "001" ? (
        <div className="relative h-[calc(var(--vh)_*_100)] w-full ">
          {/* Background pakai Img */}
          {invitation.galleries.length > 0 && (
            <Img
              src={invitation.galleries[0].image}
              alt="Background"
              wrapperClassName="absolute inset-0 w-full h-full"
              className="object-cover"
              priority
            />
          )}

          {/* Overlay hitam transparan */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Konten di depan */}
          <div className="relative z-10 flex flex-col items-center shadow-md justify-center gap-3 h-full text-white">
            <Img
              src={invitation.image}
              alt="Foto"
              wrapperClassName="aspect-[3/4] w-4/12 mx-auto shadow-md rounded-b-3xl rounded-t-[200px] overflow-hidden border border-slate-300 mb-3"
              sizes="300px"
              priority
              data-aos="zoom-in"
            />

            <h1 className="text-lg font-medium" data-aos="fade-up">
              The Wedding Of
            </h1>
            <div
              className="font-italiana text-5xl"
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
              {formatDate(getEffectiveDate(invitation), "dd . MM . yyyy")}
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
              <div>{invitation.guest.address}</div>
            </div>

            <Button
              variant="outline-white"
              onClick={onClose}
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

export default InvitationModalLuxury;
