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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Konfirmasi Pembatalan</DialogTitle>
          <DialogDescription>
            Pesanan kamu akan dibatalkan dan tidak bisa dikembalikan. Apakah
            kamu yakin ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="outline"
            onClick={handleConfirm}
            isLoading={loading}
            className="w-full border-red-300 text-red-600 hover:bg-red-100"
          >
            Ya, Batalkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CancelConfirmationModal;
