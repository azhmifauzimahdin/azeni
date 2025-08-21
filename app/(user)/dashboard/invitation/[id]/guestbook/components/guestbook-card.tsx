"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Eye,
  Trash2,
  Pencil,
  Share2,
  LogIn,
  LogOut,
  BadgeHelp,
  Users,
  MapPin,
  Loader2,
} from "lucide-react";
import { Guest } from "@/types";
import * as React from "react";
import { cn } from "@/lib/utils";
import { IoLogoWhatsapp } from "react-icons/io5";

export function GuestBookCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 sm:p-6 shadow-sm bg-white flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-pulse">
      <div className="flex-1 space-y-3">
        {/* Nama tamu */}
        <div className="h-6 sm:h-7 w-1/2 bg-muted rounded" />

        {/* Badge code, group, address */}
        <div className="flex flex-col sm:flex-row items-start flex-wrap gap-2">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
        </div>

        {/* Status check-in & check-out */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="h-5 w-28 bg-muted rounded" />
          <div className="h-5 w-28 bg-muted rounded" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 flex gap-2 items-center self-end sm:self-center">
        <div className="h-9 w-9 bg-muted rounded-md" />
        <div className="h-9 w-9 bg-muted rounded-md" />
        <div className="h-9 w-9 bg-muted rounded-md" />
      </div>
    </div>
  );
}

interface GuestBookCardProps {
  data: Guest;
  onEdit: (guestId: string) => void;
  onDelete: (guestId: string, guestName: string) => void;
  onShareWhatsApp: (guestName: string, code: string) => void;
  onShareLink: (guest: Guest) => void;
  onViewInvitation: (code: string) => void;
  onCheckIn: (guestId: string, name: string) => void;
  onCheckOut: (guestId: string, name: string) => void;
  checkInOrCheckOutId?: string;
}

const GuestBookCard: React.FC<GuestBookCardProps> = ({
  data,
  onEdit,
  onDelete,
  onShareWhatsApp,
  onShareLink,
  onViewInvitation,
  onCheckIn,
  onCheckOut,
  checkInOrCheckOutId,
}) => {
  return (
    <div className="rounded-xl border p-4 sm:p-6 shadow-sm bg-white flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1 space-y-3">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 break-words">
          {data.name}
        </h3>

        <div className="flex flex-col sm:flex-row items-start flex-wrap gap-2">
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
            <BadgeHelp className="w-4 h-4" />
            {data.code}
          </div>
          {data.group && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {data.group}
            </div>
          )}
          {data.address && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {data.address}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span
            className={cn("px-2 py-0.5 rounded", {
              "bg-green-100 text-green-700": data.isCheckedIn,
              "bg-gray-200 text-gray-500": !data.isCheckedIn,
            })}
          >
            {data.isCheckedIn ? "Sudah Check-in" : "Belum Check-in"}
          </span>
          <span
            className={cn("px-2 py-0.5 rounded", {
              "bg-red-100 text-red-700": !!data.checkedOutAt,
              "bg-gray-200 text-gray-500": !data.checkedOutAt,
            })}
          >
            {data.checkedOutAt ? "Sudah Check-out" : "Belum Check-out"}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-2 items-center self-end sm:self-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onShareWhatsApp(data.name, data.code)}
        >
          <IoLogoWhatsapp size={20} />
        </Button>

        <Button variant="outline" size="icon" onClick={() => onShareLink(data)}>
          <Share2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={checkInOrCheckOutId === data.id}
            >
              {checkInOrCheckOutId === data.id && (
                <Loader2 className="absolute h-4 w-4 animate-spin" />
              )}

              <div
                className={cn("inline-flex items-center justify-center gap-2", {
                  invisible: checkInOrCheckOutId === data.id,
                })}
              >
                <MoreVertical className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 text-center">
            <DropdownMenuItem
              onClick={() => onViewInvitation(data.code)}
              className="flex items-center gap-2 py-2 cursor-pointer"
            >
              <Eye className="h-5 w-5" />
              <span className="text-xs">Lihat Undangan</span>
            </DropdownMenuItem>

            <div className="my-1 h-px bg-muted" />
            {!data.isCheckedIn ? (
              <DropdownMenuItem
                onClick={() => onCheckIn(data.id, data.name)}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-xs">Check-in</span>
              </DropdownMenuItem>
            ) : (
              !data.checkedOutAt && (
                <DropdownMenuItem
                  onClick={() => onCheckOut(data.id, data.name)}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-xs">Check-out</span>
                </DropdownMenuItem>
              )
            )}

            {!data.isCheckedIn || !data.checkedOutAt ? (
              <div className="my-1 h-px bg-muted" />
            ) : null}

            <DropdownMenuItem
              onClick={() => onEdit(data.id)}
              className="flex items-center gap-2 py-2 cursor-pointer"
            >
              <Pencil className="h-5 w-5" />
              <span className="text-xs">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(data.id, data.name)}
              className="flex items-center gap-2 py-2 cursor-pointer text-red-600"
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-xs">Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GuestBookCard;
