"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  loading = false,
  title = "Konfirmasi Hapus Data",
  description = "",
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
          <div className="flex justify-center text-red-500 mb-2">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-sm text-center text-muted-foreground">
            Apakah Anda yakin ingin menghapus data&nbsp;
            <span className="font-semibold text-red-600">{description}</span>?
            Tindakan ini tidak dapat dibatalkan.
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
          >
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteConfirmationModal;
