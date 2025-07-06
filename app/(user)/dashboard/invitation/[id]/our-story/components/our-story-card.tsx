"use client";

import Image from "next/image";
import { ImageOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Story } from "@/types";
import { useEffect, useState } from "react";

export const OurStoryCardSkeleton = () => {
  return (
    <div className="relative pl-6">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-200 border-2 border-white shadow z-10" />

      <div className="flex flex-row items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <div className="flex justify-start">
            <div className="w-[144px] aspect-square bg-gray-100 rounded-lg" />
          </div>

          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>

        <div className="flex items-center self-stretch">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

interface OurStoryCardProps {
  data: Story;
  onClick: (ourStoryId: string) => void;
  onDelete?: (ourStoryId: string, ourStoryName: string) => void;
  isLoadingDelete?: boolean;
}

export const OurStoryCard: React.FC<OurStoryCardProps> = ({
  data,
  onClick,
  onDelete,
  isLoadingDelete,
}) => {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!data.image) return;
    const img = new window.Image();
    img.src = data.image;
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
  }, [data.image]);

  return (
    <div className="relative pl-6" onClick={() => onClick(data.id)}>
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-app-primary border-2 border-white shadow z-10" />

      <div className="flex flex-row items-center gap-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm transition duration-300 cursor-pointer">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <div className="flex justify-start">
            {data.image && aspectRatio ? (
              <div
                className="bg-white rounded-lg overflow-hidden"
                style={{
                  width: 144,
                  height: 144 / aspectRatio,
                }}
              >
                <Image
                  src={data.image}
                  alt={data.title}
                  width={144}
                  height={Math.round(144 / aspectRatio)}
                  className="object-contain rounded-lg"
                  sizes="(max-width: 144px) 100vw, 144px"
                  priority
                />
              </div>
            ) : data.image ? (
              <div className="w-[144px] aspect-square bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <div className="w-[144px] aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                <ImageOff className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {data.title}
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              {formatDate(new Date(data.date))}
            </p>
            <p className="text-sm text-slate-700">{data.description}</p>
          </div>
        </div>

        {onDelete && (
          <div className="flex items-center self-stretch">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id, data.title);
              }}
              className="text-destructive hover:text-red-600"
              isLoading={isLoadingDelete}
            >
              <X />
              <span className="sr-only">Hapus cerita</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurStoryCard;
