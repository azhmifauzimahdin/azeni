"use client";

import React, { useMemo } from "react";
import { Heading } from "@/components/ui/heading";
import AdminCard from "./admin-card";
import useAdminInvitations from "@/hooks/use-admin-invitation";
import { Invitation } from "@/types";
import InvitationChart from "./admin-charts";

const AdminContent: React.FC = () => {
  const { invitations, isFetching } = useAdminInvitations();

  const dataCard = useMemo(() => {
    const now = new Date();
    const safeInvitations = invitations ?? [];

    const totalActiveInvitations = safeInvitations.filter((inv) => {
      return (
        inv.transaction?.status.name === "SUCCESS" &&
        new Date(inv.expiresAt) > now
      );
    }).length;

    const totalTransactions = safeInvitations.reduce((total, inv) => {
      return total + Number(inv.transaction?.amount ?? 0);
    }, 0);

    const upcomingInvitations = safeInvitations
      .map((inv) => {
        if (inv.useScheduleDate) {
          if (!inv.schedules || inv.schedules.length === 0) return null;

          const sorted = [...inv.schedules].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

          const earliest = new Date(sorted[0].startDate);
          if (earliest > now) {
            return {
              ...inv,
              eventDate: earliest,
            };
          }

          return null;
        }

        if (inv.date) {
          const date = new Date(inv.date);
          if (date > now) {
            return {
              ...inv,
              eventDate: date,
            };
          }
        }

        return null;
      })
      .filter(Boolean) as (Invitation & { eventDate: Date })[];

    const nextEventInvitation = upcomingInvitations.sort(
      (a, b) => a.eventDate.getTime() - b.eventDate.getTime()
    )[0];

    const nextEvent = nextEventInvitation
      ? {
          coupleName: `${nextEventInvitation.groom} & ${nextEventInvitation.bride}`,
          date: nextEventInvitation.eventDate,
        }
      : null;

    return {
      totalActiveInvitations,
      totalTransactions,
      nextEvent,
    };
  }, [invitations]);

  return (
    <>
      <div>
        <Heading title="Dashboard" />
      </div>
      <div className="space-y-6">
        <AdminCard data={dataCard} isFetching={isFetching} />
        <InvitationChart invitations={invitations} />
      </div>
    </>
  );
};

export default AdminContent;
