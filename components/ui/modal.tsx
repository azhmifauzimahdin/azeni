"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  initialFocusRef,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          if (initialFocusRef?.current) {
            e.preventDefault();
            initialFocusRef.current.focus();
          }
        }}
        className="max-h-[calc(var(--vh)_*_96)] p-0 flex flex-col gap-1 overflow-hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white pl-6 pr-3 pt-3">
          <DialogHeader className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only" />
            )}
          </DialogHeader>
          <DialogClose asChild>
            <button
              className="rounded-md p-2 hover:bg-muted"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        <div className="overflow-y-auto scrollbar-hide flex-1 p-6 pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
