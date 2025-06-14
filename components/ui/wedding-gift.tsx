import { Copy, Gift } from "lucide-react";
import { Button } from "./button";
import Image from "./image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BankAccount } from "@/types";

interface WeddingGiftProps {
  banks: BankAccount[];
}

const WeddingGift: React.FC<WeddingGiftProps> = ({ banks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async (nomor: string) => {
    try {
      await navigator.clipboard.writeText(nomor);
      toast.success("Nomor rekening berhasil disalin");
      console.log("Masuk");
    } catch (err) {
      toast.error("Nomor rekening gagal disalin");
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="text-white text-center">
      <h2 className="section-title !text-white" data-aos="zoom-in">
        Wedding Gift
      </h2>
      <p className="mb-5" data-aos="zoom-in">
        Doa restu Bapak/Ibu/Saudara/i sudah merupakan hadiah terbaik bagi kami.
        Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi
        kado secara cashless.
      </p>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
        className="bg-green-primary border border-slate-50 hover:bg-slate-50 hover:text-green-primary mb-10"
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
            className="grid grid-cols-1 gap-5 h-0 overflow-hidden"
          >
            {banks.map((bank, index) => (
              <React.Fragment key={index}>
                {bank.bank.name == "Kado" ? (
                  <div
                    className="rounded-lg p-5 bg-[url('/assets/img/bg-atm.jpg')] bg-img-default text-slate-900 text-center flex-center flex-col gap-3 order-last"
                    key={index}
                  >
                    <Gift size={64} className="mb-3 text-slate-600" />
                    <p>Anda juga bisa kirim kado fisik ke alamat berikut:</p>
                    <p>{bank.name}</p>
                  </div>
                ) : (
                  <div className="rounded-lg p-5 bg-[url('/assets/img/bg-atm.jpg')] bg-img-default">
                    <div className="flex justify-end">
                      {bank.bank.name == "Mandiri" ? (
                        <Image
                          src="/assets/svg/bank-mandiri.svg"
                          alt="Logo Bank"
                          aspectRatio="aspect-[3/1]"
                          className="w-3/12"
                          objectFit="h-full object-contain"
                        />
                      ) : bank.bank.name == "BCA" ? (
                        <Image
                          src="/assets/svg/bank-bca.svg"
                          alt="Logo Bank"
                          aspectRatio="aspect-[3/1]"
                          className="w-3/12"
                          objectFit="h-full object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="text-left">
                      <Image
                        src="/assets/img/chip-atm.png"
                        alt="ATM Chip"
                        aspectRatio="aspect-square"
                        className="w-2/12 mb-2"
                        objectFit="h-full object-contain"
                      />
                      <div className="flex justify-between">
                        <div className="text-slate-600 text-2xl font-medium mb-5">
                          {bank.nomor.replace(/(.{4})/g, "$1 ").trim()}
                        </div>
                        <div>
                          <Button
                            variant="default"
                            className="bg-slate-200 text-slate-800 hover:bg-slate-100"
                            onClick={() => handleCopy(bank.nomor)}
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
