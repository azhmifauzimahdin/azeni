"use client";

import React, { useState } from "react";
import useUserInvitations from "@/hooks/use-user-invitation";
import Stepper from "@/components/ui/stepper";
import { useRouter } from "next/navigation";
import { TransactionService } from "@/lib/services";
import axios from "axios";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";
import useInvitationStore from "@/stores/invitation-store";
import InvitationCheckoutCard from "./invitation-checkout-card";
import useTransactionStore from "@/stores/transaction-store";

interface InvitationCheckoutFormProps {
  params: {
    id: string;
  };
}

const InvitationCheckoutForm: React.FC<InvitationCheckoutFormProps> = ({
  params,
}) => {
  const { getInvitationById, isFetching } = useUserInvitations();
  const invitation = getInvitationById(params.id);
  const router = useRouter();

  const [isApplyingReferral, setIsApplyingReferral] = useState<boolean>(false);
  const [isDeletingReferral, setIsDeletingReferral] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const updateTransactionInInvitation = useInvitationStore(
    (state) => state.updateTransactionInInvitation
  );
  const addOrUpdateGuestToInvitation = useInvitationStore(
    (state) => state.addOrUpdateGuestToInvitation
  );
  const updateSettingInInvitation = useInvitationStore(
    (state) => state.updateSettingInInvitation
  );
  const updateTransactionById = useTransactionStore(
    (state) => state.updateTransactionById
  );

  const onApplyReferral = async (code: string) => {
    try {
      if (code === "") setIsDeletingReferral(true);
      else setIsApplyingReferral(true);
      const res = await TransactionService.applyReferralByInvitationId(
        params.id,
        { referralCode: code }
      );
      updateTransactionInInvitation(params.id, res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
        } else {
          handleError(error, "referral");
        }
      }
    } finally {
      if (code === "") setIsDeletingReferral(false);
      else setIsApplyingReferral(false);
    }
  };

  const onCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const res = await TransactionService.checkoutByInvitationId(params.id);
      updateTransactionInInvitation(params.id, res.data.transaction);
      addOrUpdateGuestToInvitation(params.id, res.data.guest);
      updateSettingInInvitation(params.id, res.data.setting);
      updateTransactionById(res.data.transaction.id, res.data.transaction);
      router.push(
        `payment?order_id=${res.data.transaction.orderId}&status_code=201&transaction_status=pending`
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
        } else {
          handleError(error, "referral");
        }
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Stepper currentStep={2} />
      <InvitationCheckoutCard
        invitation={invitation}
        onApplyReferral={(code: string) => onApplyReferral(code)}
        onCheckout={onCheckout}
        isApplyingReferral={isApplyingReferral}
        isDeletingReferral={isDeletingReferral}
        isCheckingOut={isCheckingOut}
        isFetching={isFetching}
      />
    </>
  );
};

export default InvitationCheckoutForm;
