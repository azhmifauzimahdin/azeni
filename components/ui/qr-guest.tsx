"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import toast from "react-hot-toast";
import { Img } from "./Img";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface QrDownloadDialogProps {
  codeGuest: string;
}

export const QrDownloadDialog = ({ codeGuest }: QrDownloadDialogProps) => {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(codeGuest, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch(() => toast.error("Gagal membuat QR Code"));
  }, [codeGuest]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "fixed bottom-[33%] -right-1 z-40",
            "rounded-l-xl rounded-r-none flex items-center gap-2 shadow-lg backdrop-blur-md bg-white/30 text-primary hover:bg-white/40 transition-all px-3 py-2"
          )}
          aria-label="Tampilkan QR Undangan"
        >
          <QrCode className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            QR Code Check-in / Check-out
          </DialogTitle>
          <DialogDescription className="text-center">
            Pindai QR ini saat datang dan pulang.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          {qrDataUrl ? (
            <Img
              src={qrDataUrl}
              alt="QR Code Undangan"
              wrapperClassName="w-full aspect-square"
              className="w-full h-full object-contain"
              sizes="192px"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Membuat QR Code...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
