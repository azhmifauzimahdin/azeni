"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralWithdrawal } from "@/types";
import {
  Check,
  History,
  Wallet,
  X,
  Hash,
  User,
  Banknote,
  Copy,
} from "lucide-react";
import { ApprovalDataTable } from "./approval-data-table";
import { approvalColumns } from "./approval-columns";
import { useForm } from "react-hook-form";
import { updateWithdrawalStatusSchema } from "@/lib/schemas/referral-code";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormLabelText,
  FormMessage,
} from "@/components/ui/form";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./image-upload";
import { ImageService, ReferralCodeService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { useAdminReferralWithdrawalStore } from "@/stores/admin-referral-withdrawal-store";
import toast from "react-hot-toast";
import { HistoryDataTable } from "./history-data-table";
import { historyColumns } from "./history-columns";
import { formatRupiah } from "@/lib/utils/currency";
import ImagePreviewModal from "@/components/ui/image-preview-modal";
import useAdminReferralCodeStore from "@/stores/admin-referral-store";

type ReferralWithdrawalFormValues = z.infer<
  typeof updateWithdrawalStatusSchema
>;

interface ReferralWithdrawalFormsProps {
  initialData: ReferralWithdrawal[] | undefined;
  isFetching?: boolean;
}

const ReferralWithdrawalForm: React.FC<ReferralWithdrawalFormsProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalPreviewImageOpen, setIsModalPreviewImageOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [updatingWithdrawalId, setUpdatingWithdrawalId] = useState<
    string | null
  >(null);
  const [imageDelete, setImageDelete] = useState<string[]>([]);
  const [withdrawal, setWitdhrawal] = useState<ReferralWithdrawal | undefined>(
    undefined
  );

  const pendingData = useMemo(() => {
    return (initialData ?? []).filter((item) => item.status === "PENDING");
  }, [initialData]);

  const nonPendingData = useMemo(() => {
    return (initialData ?? []).filter((item) => item.status !== "PENDING");
  }, [initialData]);

  const upsertReferralWithdrawalAtFirst = useAdminReferralWithdrawalStore(
    (state) => state.upsertReferralWithdrawalAtFirst
  );
  const upsertWithdrawalToReferralCode = useAdminReferralCodeStore(
    (state) => state.upsertWithdrawalToReferralCode
  );

  const form = useForm<ReferralWithdrawalFormValues>({
    resolver: zodResolver(updateWithdrawalStatusSchema),
    defaultValues: {
      status: "APPROVED",
      transferProofUrl: "",
      note: "",
    },
  });

  const onSubmit = async (data: ReferralWithdrawalFormValues) => {
    try {
      if (!updatingWithdrawalId) return;
      setIsLoading(true);
      await deleteAllImages();
      const res = await ReferralCodeService.updateStatusReferralCodeWithdrawal(
        updatingWithdrawalId,
        data
      );
      upsertReferralWithdrawalAtFirst(res.data);
      upsertWithdrawalToReferralCode(res.data.referralCode.id, res.data);
      toast.success("Penarikan dana berhasil diproses.");
      form.reset({
        status: "APPROVED",
        transferProofUrl: "",
        note: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      handleError(error, "update status referral code withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteImage = async (publicId: string) => {
    try {
      setIsLoading(true);
      await ImageService.deleteImageByPublicId(publicId);
    } catch (error) {
      handleError(error, "delete image");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllImages = async () => {
    await Promise.all(imageDelete.map((id) => onDeleteImage(id)));
    setImageDelete([]);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Nomor rekening berhasil di salin.");
  };

  return (
    <>
      <Modal
        title="Penarikan Dana"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className="p-3 w-full rounded-lg border bg-white mb-3">
          <p className="text-2xl font-bold mb-6 text-green-app-primary">
            {formatRupiah(Number(withdrawal?.amount ?? 0))}
          </p>

          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-green-app-primary" />
              <span>Nama Bank: {withdrawal?.bank.name}</span>
            </div>
            <div
              className="flex items-center gap-3"
              onClick={() => copyToClipboard(withdrawal?.accountNumber || "")}
            >
              <Hash className="w-5 h-5 text-green-app-primary" />
              <span>Nomor Rekening: {withdrawal?.accountNumber}&nbsp;</span>
              <Copy className="w-4 h-4 hover:text-green-app-primary cursor-pointer" />
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-app-primary" />
              <span>Nama Rekening: {withdrawal?.name}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {status === "APPROVED" ? (
              <FormField
                control={form.control}
                name="transferProofUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelText required>Bukti Pembayaran</FormLabelText>
                    <FormControl>
                      <ImageUpload
                        id={field.name}
                        disabled={isLoading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={(publicId) => {
                          setImageDelete((prev) => [...prev, publicId]);
                          field.onChange("");
                        }}
                        value={field.value || ""}
                        path="users/transfer-proofs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} required>
                      Catatan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        placeholder="Nomor rekening tidak terdaftar"
                        disabled={isLoading}
                        className="h-44"
                        isFetching={isFetching}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col md:flex-row items-center justify-end gap-3">
              <Button
                variant={status === "APPROVED" ? "primary" : "destructive"}
                isLoading={isLoading}
                className="w-full md:w-auto"
                type="submit"
              >
                {status === "APPROVED" ? (
                  <>
                    <Check />
                    Terima
                  </>
                ) : (
                  <>
                    <X /> Tolak
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <ImagePreviewModal
        url={withdrawal?.transferProofUrl ?? ""}
        open={isModalPreviewImageOpen}
        onOpenChange={setIsModalPreviewImageOpen}
      />
      <Card>
        <CardContent className="pt-3 sm:pt-6 space-y-4">
          <Tabs defaultValue="approval" className="space-y-6">
            <TabsList
              className="flex w-full flex-col sm:flex-row bg-muted p-1"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              <TabsTrigger
                value="approval"
                className="flex items-center gap-2 justify-center"
              >
                <Wallet className="h-4 w-4" /> Penarikan Dana
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 justify-center"
              >
                <History className="h-4 w-4" /> Riwayat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approval">
              <ApprovalDataTable
                data={pendingData}
                columns={approvalColumns({
                  onApprove: (id) => {
                    setWitdhrawal(initialData?.find((item) => item.id === id));
                    form.setValue("status", "APPROVED");
                    setStatus("APPROVED");
                    setUpdatingWithdrawalId(id);
                    setIsModalOpen(true);
                  },
                  onReject: (id) => {
                    setWitdhrawal(initialData?.find((item) => item.id === id));
                    form.setValue("status", "REJECTED");
                    setStatus("REJECTED");
                    setUpdatingWithdrawalId(id);
                    setIsModalOpen(true);
                  },
                })}
                isFetching={isFetching}
              />
            </TabsContent>
            <TabsContent value="history">
              <HistoryDataTable
                data={nonPendingData}
                columns={historyColumns({
                  onProofClick: (id) => {
                    setWitdhrawal(initialData?.find((item) => item.id === id));
                    setIsModalPreviewImageOpen(true);
                  },
                })}
                isFetching={isFetching}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralWithdrawalForm;
