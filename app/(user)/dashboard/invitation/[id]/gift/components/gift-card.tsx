import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { BankAccount } from "@/types";
import { Img } from "@/components/ui/Img";

type BankAccountCardProps = {
  data: BankAccount;
  onDelete: (id: string, name: string) => void;
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
      className="flex items-center justify-between h- p-4 rounded-xl border shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onClick?.(data.id)}
    >
      <div className="flex items-center gap-4">
        {data.bank.icon ? (
          <Img
            src={data.bank.icon}
            alt="Logo Bank"
            wrapperClassName="aspect-[3/1] h-4"
            className="h-full object-contain"
            sizes="32px"
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
          onDelete(data.id, data.name);
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
