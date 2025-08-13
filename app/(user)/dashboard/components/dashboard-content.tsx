"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Activity, LayoutTemplate, Plus, Ticket } from "lucide-react";
import React, { useMemo } from "react";
import InvitationCard, { InvitationOverviewSkeleton } from "./dashboard-card";
import { SettingService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import toast from "react-hot-toast";
import useUserInvitations from "@/hooks/use-user-invitation";
import { LinkButton } from "@/components/ui/link";
import useReferralCode from "@/hooks/use-referral-code";

const DashboardContent: React.FC = () => {
  const { invitations, isFetching: isFetchingInvitation } =
    useUserInvitations();
  const { referralCode, isFetching: isFetchingReferral } = useReferralCode();

  const isFetching = isFetchingInvitation || isFetchingReferral;

  const successfulInvitations = useMemo(
    () =>
      (invitations ?? []).filter(
        (invitation) =>
          invitation.transaction?.status?.name === "SUCCESS" &&
          new Date(invitation.expiresAt) > new Date()
      ),
    [invitations]
  );

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
        <LinkButton href="/dashboard/invitation/new/theme" variant="primary">
          <Plus className="mr-2" size={16} />
          Buat Undangan
        </LinkButton>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isFetching ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="shadow-sm border border-muted bg-white dark:bg-muted animate-pulse"
                >
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
              ))}
            </>
          ) : (
            <>
              <Card className="shadow-sm border border-muted bg-white dark:bg-muted">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Undangan
                  </CardTitle>
                  <LayoutTemplate className="w-5 h-5 text-green-app-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{invitations.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border border-muted bg-white dark:bg-muted">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Undangan Aktif
                  </CardTitle>
                  <Activity className="w-5 h-5 text-green-app-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {successfulInvitations.length}
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border border-muted bg-white dark:bg-muted">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Penggunaan Kode Referral
                  </CardTitle>
                  <Ticket className="w-5 h-5 text-green-app-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {(referralCode?.transactions || []).length}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Undangan Aktif Kamu
          </h2>
          {isFetching ? (
            <div className="grid grid-cols-1 gap-3">
              {[...Array(4)].map((_, i) => (
                <InvitationOverviewSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {successfulInvitations.map((invitation) => (
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
