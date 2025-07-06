"use client";

import { Button } from "@/components/ui/button";
import { Schedule } from "@/types";
import { CalendarDays, MapPin, X } from "lucide-react";
import React from "react";

export const ScheduleCardSkeleton = () => {
  return (
    <div className="relative pl-6">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-md z-10" />

      <div className="flex justify-between items-center bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-40 bg-gray-300 rounded" />

          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded mt-1" />
            <div className="space-y-1">
              <div className="h-3 w-32 bg-gray-300 rounded" />
              <div className="h-2 w-24 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded mt-1" />
            <div className="space-y-1">
              <div className="h-3 w-40 bg-gray-300 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="w-8 h-8 bg-gray-200 rounded-full ml-4" />
      </div>
    </div>
  );
};

interface ScheduleCardProps {
  data: Schedule;
  onClick: (sceduleId: string) => void;
  onDelete?: (sceduleId: string, scheduleName: string) => void;
  isLoadingDelete?: boolean;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  data,
  onClick,
  onDelete,
  isLoadingDelete,
}) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="relative pl-6" onClick={() => onClick(data.id)}>
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-app-primary border-2 border-white shadow-md z-10" />

      <div className="flex justify-between items-center bg-white cursor-pointer hover:bg-gray-100 rounded-xl border border-gray-200 p-4 shadow-sm transition duration-300">
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">
            {data.name}
          </h3>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <CalendarDays className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p>{formatDate(new Date(data.startDate))}</p>
                <p className="text-xs text-slate-400">
                  {formatTime(new Date(data.startDate))} -{" "}
                  {formatTime(new Date(data.endDate))} {data.timezone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
              <div>
                <p>{data.location}</p>
                <a
                  href={data.locationMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  📍 Lihat di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
        {onDelete && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id, data.name);
              }}
              className="text-destructive hover:text-red-600"
              isLoading={isLoadingDelete}
            >
              <X />
              <span className="sr-only">Hapus rekening</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
