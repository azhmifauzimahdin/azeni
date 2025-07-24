"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CancelConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

const CancelConfirmationModal: React.FC<CancelConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  loading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center text-red-500 mb-2">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <DialogTitle className="text-center">
            Konfirmasi Pembatalan
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-muted-foreground">
            Pesanan kamu akan&nbsp;
            <span className="font-semibold text-red-600">dibatalkan</span> dan
            tidak bisa dikembalikan. Apakah kamu yakin ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={loading}
            className="w-full"
          >
            Ya, Batalkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmationModal;
