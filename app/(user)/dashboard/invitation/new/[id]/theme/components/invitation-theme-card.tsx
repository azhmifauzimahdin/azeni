import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import { formatRupiah } from "@/lib/utils/currency";
import { Theme } from "@/types";
import React from "react";

type ThemeCardProps = {
  data: Theme;
  isActive: boolean;
  loading?: boolean;
  onActivate: (id: string) => void;
  demoHref: string;
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  data,
  isActive,
  loading,
  onActivate,
  demoHref,
}) => {
  const originalPrice = Number(data.originalPrice);
  const discount = Number(data.discount);
  const hasDiscount = discount > 0;

  const discountedPrice = data.isPercent
    ? originalPrice - (originalPrice * discount) / 100
    : originalPrice - discount;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <Img
        src={data.thumbnail}
        alt={data.name}
        wrapperClassName="w-full aspect-square"
        sizes="50vw"
      />

      <div className="p-3 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold capitalize">{data.name}</h3>
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatRupiah(originalPrice)}
              </span>
              <span className="text-base font-semibold text-green-app-primary">
                {formatRupiah(discountedPrice)}
              </span>
            </div>
          ) : (
            <div className="text-base font-semibold text-green-app-primary">
              {formatRupiah(originalPrice)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="primary"
            disabled={isActive}
            isLoading={loading}
            type="button"
            onClick={() => onActivate(data.id)}
          >
            Pilih
          </Button>
          <LinkButton variant="secondary" href={demoHref} target="_blank">
            Lihat Demo
          </LinkButton>
        </div>

        {isActive && (
          <div className="absolute top-0 right-0 m-3 bg-green-app-primary text-white text-xs px-3 py-1 rounded-full shadow">
            Tema Aktif
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeCard;
