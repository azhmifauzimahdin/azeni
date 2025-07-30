"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { LayoutTemplate, Plus } from "lucide-react";
import React from "react";
import InvitationCard, { InvitationOverviewSkeleton } from "./dashboard-card";
import { SettingService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import toast from "react-hot-toast";
import useUserInvitations from "@/hooks/use-user-invitation";
import { LinkButton } from "@/components/ui/link";

const DashboardContent: React.FC = () => {
  const { invitations, isFetching } = useUserInvitations();

  const updateSettingInInvitation = useInvitationStore(
    (state) => state.updateSettingInInvitation
  );

  const onToggleActive = async (val: boolean, id: string) => {
    try {
      const res = await SettingService.updateInvitationStatus(id, {
        invitationEnabled: val,
      });
      updateSettingInInvitation(id, res.data);
    } catch {
      toast.error("Gagal update status undangan.");
    }
  };

  return (
    <>
      <div className="flex gap-5 md:items-center flex-col md:flex-row justify-between">
        <Heading title="Dashboard" />
        <LinkButton href="/dashboard/invitation/new" variant="primary">
          <Plus className="mr-2" size={16} />
          Buat Undangan
        </LinkButton>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isFetching ? (
            <Card className="shadow-sm border border-muted bg-white dark:bg-muted animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                </div>
                <div className="w-5 h-5 bg-primary/40 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted-foreground/20 rounded" />
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border border-muted bg-white dark:bg-muted">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Undangan
                </CardTitle>
                <LayoutTemplate className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{invitations.length}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Undangan Kamu
          </h2>
          {isFetching ? (
            <div className="grid grid-cols-1 gap-3">
              {[...Array(4)].map((_, i) => (
                <InvitationOverviewSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  onToggleActive={(val, id) => onToggleActive(val, id)}
                  invitation={invitation}
                  isFetching={isFetching}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
