import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/link";
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
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <Img
        src={data.thumbnail}
        alt={data.name}
        wrapperClassName="w-full aspect-square"
        sizes="50vw"
      />
      <div className="p-3 space-y-3">
        <h3 className="font-semibold capitalize">{data.name}</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="primary"
            disabled={isActive}
            isLoading={loading}
            type="button"
            onClick={() => onActivate(data.id)}
          >
            Aktifkan
          </Button>
          <LinkButton variant="secondary" href={demoHref} target="_blank">
            Lihat Demo
          </LinkButton>
        </div>
        {isActive ? (
          <div className="absolute top-0 right-0 m-3 bg-green-app-primary text-white text-xs px-3 py-1 rounded-full shadow">
            Tema Aktif
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ThemeCard;
