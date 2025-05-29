import React from "react";
import { Button } from "../ui/button";
import { MailOpen } from "lucide-react";

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full bg-[url('/img/bg-modal-themeA.jpg')] bg-cover bg-center bg-no-repeat"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center justify-center h-full gap-2"
        data-aos="zoom-in"
      >
        <div>Undangan Pernikahan</div>
        <div className="font-dancing text-4xl">Azhmi & Eni</div>
        <div className="grid grid-cols-3 items-center gap-3 my-16">
          <div className="justify-self-end">Kamis</div>
          <div className="justify-self-center text-3xl font-medium border-r-2 border-l-2 border-slate-900 px-3">
            29
          </div>
          <div className="justify-self-start">Maret</div>
          <div className="col-span-3 text-center">2028</div>
        </div>
        <div className="text-center mb-3">
          <div>Kepada:</div>
          <div>Yth. Bapak/Ibu/Saudara/i</div>
          <div className="font-bold">Karyawan RSI Kota Magelang</div>
        </div>
        <Button
          variant="destructive"
          onClick={onClose}
          className="flex items-center"
        >
          <MailOpen />
          <div>Buka Undangan</div>
        </Button>
      </div>
    </div>
  );
};

export default InvitationModal;
