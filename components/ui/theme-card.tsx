import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
import { formatRupiah } from "@/lib/utils/currency";
import { Theme } from "@/types";
import React from "react";

export const ThemeCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded-full" />
          <div className="h-5 w-3/4 bg-gray-300 rounded-md" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="h-10 bg-gray-300 rounded-md" />
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

type ThemeCardProps = {
  data: Theme;
  buttonText?: string;
  isActive?: boolean;
  loading?: boolean;
  onActivate?: (id: string) => void;
  demoHref: string;
  showPrice?: boolean;
};

const ThemeCard: React.FC<ThemeCardProps> = ({
  data,
  buttonText = "Buat",
  isActive,
  loading,
  onActivate,
  demoHref,
  showPrice = true,
}) => {
  const originalPrice = Number(data.originalPrice);
  const discount = Number(data.discount);
  const hasDiscount = discount > 0;

  const discountedPrice = data.isPercent
    ? originalPrice - (originalPrice * discount) / 100
    : originalPrice - discount;

  const categoryName = data.category?.name || "Tanpa Kategori";

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border transition-all duration-300">
      <Img
        src={data.thumbnail}
        alt={data.name}
        wrapperClassName="w-full aspect-square"
        sizes="50vw"
      />
      {isActive && (
        <div className="absolute top-3 right-3 bg-green-app-primary text-white text-xs px-3 py-1 rounded-full shadow">
          Tema Aktif
        </div>
      )}

      <div className="p-3 sm:p-4 space-y-4">
        <div className="space-y-1">
          <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {categoryName}
          </span>

          <h3 className="font-semibold text-sm capitalize">{data.name}</h3>

          {showPrice &&
            (hasDiscount ? (
              <div className="flex items-center flex-wrap gap-2">
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
            ))}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="primary"
            disabled={isActive || loading}
            isLoading={loading}
            type="button"
            onClick={() => onActivate?.(data.id)}
          >
            {buttonText}
          </Button>
          <LinkButton variant="secondary" href={demoHref} target="_blank">
            Lihat Demo
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
