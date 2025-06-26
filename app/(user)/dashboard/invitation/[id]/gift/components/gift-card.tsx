import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { BankAccount } from "@/types";
import Image from "@/components/ui/image";

type BankAccountCardProps = {
  data: BankAccount;
  onDelete: () => void;
  onClick?: (id: string) => void;
  isLoadingDelete?: boolean;
};

const GiftCard: React.FC<BankAccountCardProps> = ({
  data,
  onDelete,
  onClick,
  isLoadingDelete,
}) => {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(data.id)}
    >
      <div className="flex items-center gap-4">
        {data.bank.icon ? (
          <Image
            src={data.bank.icon}
            alt="Logo Bank"
            aspectRatio="aspect-[3/1]"
            className="h-4"
            objectFit="h-full object-contain"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-sm" />
        )}

        <div>
          <p className="font-medium text-sm">{data.bank.name}</p>
          <p className="text-sm text-muted-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.accountNumber}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-destructive hover:text-destructive"
        isLoading={isLoadingDelete}
      >
        <X />
        <span className="sr-only">Hapus rekening</span>
      </Button>
    </div>
  );
};

export default GiftCard;
