"use client";

import React from "react";
import { Badge, BadgeProps } from "./badge";
import { Clock, CircleCheck, XCircle } from "lucide-react";

export enum WithdrawalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus;
}

const WithdrawalStatusBadge: React.FC<WithdrawalStatusBadgeProps> = ({
  status,
}) => {
  const statusVariantMap: Record<WithdrawalStatus, BadgeProps["variant"]> = {
    [WithdrawalStatus.PENDING]: "pending",
    [WithdrawalStatus.APPROVED]: "success",
    [WithdrawalStatus.REJECTED]: "failed",
  };

  const iconMap: Record<WithdrawalStatus, React.ReactNode> = {
    [WithdrawalStatus.PENDING]: <Clock size={12} />,
    [WithdrawalStatus.APPROVED]: <CircleCheck size={12} />,
    [WithdrawalStatus.REJECTED]: <XCircle size={12} />,
  };

  const labelMap: Record<WithdrawalStatus, string> = {
    [WithdrawalStatus.PENDING]: "Menunggu Persetujuan",
    [WithdrawalStatus.APPROVED]: "Disetujui",
    [WithdrawalStatus.REJECTED]: "Ditolak",
  };

  const variant = statusVariantMap[status] ?? "default";
  const icon = iconMap[status];
  const label = labelMap[status] ?? status;

  return (
    <Badge variant={variant} className="gap-2">
      {icon}
      {label}
    </Badge>
  );
};

export default WithdrawalStatusBadge;
