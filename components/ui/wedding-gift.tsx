import { Copy, Gift } from "lucide-react";
import { Button } from "./button";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BankAccount } from "@/types";
import { Img } from "./Img";
import { cn } from "@/lib/utils";

interface WeddingGiftProps {
  banks: BankAccount[];
  btnClassName: string;
}

const WeddingGift: React.FC<WeddingGiftProps> = ({ banks, btnClassName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async (nomor: string) => {
    try {
      await navigator.clipboard.writeText(nomor);
      toast.success("Nomor rekening berhasil disalin");
    } catch (err) {
      toast.error("Nomor rekening gagal disalin");
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="text-center">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("mb-10", btnClassName)}
        data-aos="zoom-in"
      >
        <Gift size={16} /> Kirim Hadiah
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="grid grid-cols-1 text-white gap-5 h-0 overflow-hidden"
          >
            {banks.map((bank, index) => (
              <React.Fragment key={index}>
                {bank.bank.name == "Kado" ? (
                  <div
                    className="rounded-lg p-5 bg-[url('/assets/img/bg-atm.jpg')] bg-img-default text-slate-900 text-center flex-center flex-col gap-3 order-last"
                    key={index}
                  >
                    <Gift size={64} className="mb-3 text-slate-600" />
                    <p>Anda bisa kirim kado fisik ke alamat berikut:</p>
                    <p>{bank.name}</p>
                  </div>
                ) : (
                  <div className="rounded-lg p-5 bg-[url('/assets/img/bg-atm.jpg')] bg-img-default">
                    <div className="flex justify-end">
                      <Img
                        src={bank.bank.icon}
                        alt="Logo Bank"
                        wrapperClassName="aspect-[4/1] w-3/12"
                        className="object-contain"
                        sizes="100px"
                      />
                    </div>
                    <div className="text-left">
                      <Img
                        src="/assets/img/chip-atm.png"
                        alt="ATM Chip"
                        wrapperClassName="aspect-square w-2/12 mb-2"
                        sizes="100px"
                      />
                      <div className="flex justify-between">
                        <div className="text-slate-600 text-2xl font-medium mb-5">
                          {bank.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                        </div>
                        <div>
                          <Button
                            variant="default"
                            className="bg-slate-200 text-slate-800 hover:bg-slate-100"
                            onClick={() => handleCopy(bank.accountNumber)}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-800">{bank.name}</p>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingGift;
