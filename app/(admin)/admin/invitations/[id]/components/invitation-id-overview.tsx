"use client";

import { Switch } from "@/components/ui/switch";
import {
  QrCode,
  Users,
  ExternalLink,
  MessageSquareHeart,
  CheckCircle,
} from "lucide-react";
import { Invitation } from "@/types";
import { Img } from "@/components/ui/Img";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

function InvitationOverviewSkeleton() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />

      <div className="relative z-10 p-6 sm:p-8 flex bg-white  flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full space-y-2">
          <div className="h-8 w-2/3 bg-muted-foreground/20 rounded animate-pulse" />

          <div className="flex flex-wrap gap-2 mt-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-[100px] bg-muted-foreground/20 backdrop-blur-sm rounded-md animate-pulse"
                />
              ))}
            <div className="h-6 w-[250px] bg-muted-foreground/20 backdrop-blur-sm rounded-md animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto items-stretch sm:items-end">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-5 w-10 rounded-full bg-muted-foreground/20 animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-md bg-white/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface InvitationOverviewProps {
  onToggleActive: (value: boolean) => void;
  invitation: Invitation | undefined;
  params: { id: string };
  isFetching?: boolean;
}

const InvitationOverview: React.FC<InvitationOverviewProps> = ({
  onToggleActive,
  invitation,
  params,
  isFetching,
}) => {
  const attendingCount = invitation?.guests.filter((g) => g.isCheckedIn).length;
  const [isActive, setIsActive] = useState(
    invitation?.setting?.invitationEnabled ?? false
  );

  useEffect(() => {
    setIsActive(invitation?.setting?.invitationEnabled ?? false);
  }, [invitation?.setting?.invitationEnabled]);

  if (isFetching) return <InvitationOverviewSkeleton />;

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-md mb-8">
      {invitation?.image ? (
        <div className="absolute inset-0">
          <Img
            src={invitation.image}
            alt="Undangan Cover"
            wrapperClassName="absolute inset-0 blur-sm brightness-75"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-teal-800/40 backdrop-blur-sm" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-green-app-primary via-[#2a9d8f] to-green-app-secondary" />
      )}

      <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {invitation?.groom} & {invitation?.bride}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 items-center text-white/90 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md">
              <Users size={16} />
              <span>{(invitation?.guests.length || 1) - 1} Tamu</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md">
              <CheckCircle size={16} />
              <span>{attendingCount} Hadir</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md">
              <MessageSquareHeart size={16} />
              <span>{(invitation?.comments.length || 1) - 1} Ucapan</span>
            </div>

            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/${invitation?.slug}/${
                invitation?.guests[invitation?.guests.length - 1].code
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md max-w-[300px] overflow-hidden hover:bg-white/20 transition"
            >
              <ExternalLink size={16} />
              <span className="truncate">{`${
                process.env.NEXT_PUBLIC_BASE_URL
              }/${invitation?.slug}/${
                invitation?.guests[invitation?.guests.length - 1].code
              }`}</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto items-stretch sm:items-end">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm">
              Undangan&nbsp;
              {isActive ? "Aktif" : "Nonaktif"}
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => {
                setIsActive(val);
                onToggleActive(val);
              }}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          <Link
            href={`/invitation/${params.id}/scan`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            <QrCode size={18} />
            Buka Scanner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvitationOverview;
