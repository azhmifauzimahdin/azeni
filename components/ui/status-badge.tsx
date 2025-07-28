"use client";

import {
  Ban,
  CircleCheck,
  Clock,
  Mail,
  RefreshCcw,
  TimerOff,
  XCircle,
} from "lucide-react";
import { Badge, BadgeProps } from "./badge";
import React from "react";

export type StatusName =
  | "CREATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "EXPIRED";

interface StatusBadgeProps {
  statusName: StatusName;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusName }) => {
  const statusVariantMap: Record<StatusName, BadgeProps["variant"]> = {
    CREATED: "created",
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    EXPIRED: "expired",
  };

  const iconMap: Record<StatusName, React.ReactNode> = {
    CREATED: <Mail size={12} />,
    PENDING: <Clock size={12} />,
    SUCCESS: <CircleCheck size={12} />,
    FAILED: <XCircle size={12} />,
    CANCELLED: <Ban size={12} />,
    REFUNDED: <RefreshCcw size={12} />,
    EXPIRED: <TimerOff size={12} />,
  };

  const labelMap: Record<StatusName, string> = {
    CREATED: "Dibuat",
    PENDING: "Menunggu Pembayaran",
    SUCCESS: "Lunas",
    FAILED: "Gagal",
    CANCELLED: "Dibatalkan",
    REFUNDED: "Dikembalikan",
    EXPIRED: "Kedaluwarsa",
  };

  const variant = statusVariantMap[statusName] ?? "default";
  const icon = iconMap[statusName];
  const label = labelMap[statusName] ?? statusName;

  return (
    <Badge variant={variant} className="gap-2">
      {icon}
      {label}
    </Badge>
  );
};

export default StatusBadge;
