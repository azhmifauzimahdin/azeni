"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogTitle } from "./dialog";
import Image from "next/image";
import { Button } from "./button";
import { cloudinaryProxyLoader } from "@/lib/cloudinary-loader";
import { X } from "lucide-react";

interface ImagePrevieModalProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const ImagePreviewModal: React.FC<ImagePrevieModalProps> = ({
  url,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl bg-transparent p-0 border-none shadow-none mx-auto px-4 sm:px-6 md:px-8">
        <div className="sr-only">
          <DialogTitle>Preview Gambar</DialogTitle>
          <DialogDescription>Preview gambar.</DialogDescription>
        </div>
        <div className="relative h-[75vh] md:h-[90vh] flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
          <div className="flex items-center justify-center px-4 py-6 w-full">
            <div className="relative inline-block">
              <Image
                {...(url.includes("res.cloudinary.com") && {
                  loader: cloudinaryProxyLoader,
                })}
                src={url}
                alt="Preview Image"
                width={0}
                height={0}
                sizes="300px"
                style={{
                  height: "60vh",
                  width: "auto",
                  maxWidth: "100%",
                  minWidth: "300px",
                  minHeight: "200px",
                }}
                className="block object-contain rounded-md"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-50 text-black bg-white/80 hover:bg-white backdrop-blur-sm p-1 rounded-full shadow"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
