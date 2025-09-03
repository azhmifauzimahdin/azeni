"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralCodeService } from "@/lib/services";
import { formatRupiah } from "@/lib/utils/currency";
import { handleError } from "@/lib/utils/handle-error";
import { useReferralCodeStore } from "@/stores/referral-code-store";
import {
  BalanceReferralCode,
  Bank,
  ReferralCode,
  ReferralWithdrawal,
} from "@/types";
import {
  Copy,
  CreditCard,
  Gift,
  History,
  Send,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { transactionColumns } from "./transaction-columns";
import { TransactionDataTable } from "./transaction-data-table";
import { WithdrawalDataTable } from "./withdrawal-data-table";
import { withdrawalColumns } from "./withdrawal-columns";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { referralWithdrawalFormSchema } from "@/lib/schemas/referral-code";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Combobox from "@/components/ui/combobox";
import { Img } from "@/components/ui/Img";
import ImagePreviewModal from "@/components/ui/image-preview-modal";

const ReferralCardSkeleton = () => {
  return (
    <div className="w-full border border-gray-300 rounded-md shadow-sm p-3 animate-pulse bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-gray-300 rounded w-6 h-6" />

          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-36 bg-gray-300 rounded"></div>
            <div className="h-8 w-40 bg-gray-300 rounded"></div>
            <div className="h-3 w-48 bg-gray-300 rounded mt-1"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="h-4 w-28 bg-gray-300 rounded mb-1 sm:mb-0"></div>
          <div className="h-8 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

type ReferralWithdrawalFormValues = z.infer<
  ReturnType<typeof referralWithdrawalFormSchema>
>;

interface ReferralCodeFormsProps {
  referralCode: ReferralCode | undefined;
  balanceReferralCode: BalanceReferralCode | undefined;
  banks: Bank[] | undefined;
  isFetching?: boolean;
}

const ReferralCodeForm: React.FC<ReferralCodeFormsProps> = ({
  referralCode,
  balanceReferralCode,
  banks,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalPreviewImageOpen, setIsModalPreviewImageOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withdrawal, setWitdhrawal] = useState<ReferralWithdrawal | undefined>(
    undefined
  );

  const setReferralCode = useReferralCodeStore(
    (state) => state.setReferralCode
  );

  const addWithdrawal = useReferralCodeStore((state) => state.addWithdrawal);

  const bankOptions = useMemo(() => {
    if (!banks) return [];
    return banks.map((bank) => ({
      value: bank.id,
      label: (
        <span className="flex items-center gap-3">
          {bank.icon && (
            <Img
              src={bank.icon}
              alt="Logo Bank"
              wrapperClassName="aspect-[3/1] h-3"
              className="h-full object-contain"
              sizes="15px"
            />
          )}
          {bank.name}
        </span>
      ),
      searchText: bank.name,
    }));
  }, [banks]);

  const form = useForm<ReferralWithdrawalFormValues>({
    resolver: zodResolver(
      referralWithdrawalFormSchema(
        10000,
        Number(balanceReferralCode?.availableBalance ?? 0)
      )
    ),
    defaultValues: {
      amount: "0",
      bankId: "",
      accountNumber: "",
      name: "",
    },
  });

  const onSubmit = async (data: ReferralWithdrawalFormValues) => {
    try {
      setIsLoading(true);
      const res = await ReferralCodeService.createReferralCodeWithdrawal(data);
      addWithdrawal(res.data);
      toast.success("Permohonan penarikan dana berhasil diajukan.");
      form.reset({
        amount: "0",
        bankId: "",
        accountNumber: "",
        name: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      handleError(error, "create referral code withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferral = async () => {
    try {
      setIsLoading(true);
      const res = await ReferralCodeService.generateCodeByUserId();
      setReferralCode(res.data);
      toast.success("Kode referral berhasil digenerate.");
    } catch (error: unknown) {
      handleError(error, "generate referral code");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode.code);
    toast.success("Kode referral berhasil disalin.");
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
        <Alert variant="default" className="mb-4">
          Permohonan penarikan dana akan diproses dalam waktu maksimal 7 hari
          kerja, dengan estimasi waktu paling cepat 1 hari kerja.
        </Alert>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Nominal Penarikan
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type="currency"
                      placeholder="0"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(referralCode?.withdrawals || []).length > 0 && (
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="w-4 h-4" />
                    Gunakan bank terakhir
                  </div>
                  <div className="text-muted-foreground">
                    {referralCode?.withdrawals[0].bank.name} •&nbsp;
                    {referralCode?.withdrawals[0].name} •&nbsp;
                    {referralCode?.withdrawals[0].accountNumber}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    form.setValue(
                      "bankId",
                      referralCode?.withdrawals[0].bank.id ?? ""
                    );
                    form.setValue(
                      "name",
                      referralCode?.withdrawals[0].name ?? ""
                    );
                    form.setValue(
                      "accountNumber",
                      referralCode?.withdrawals[0].accountNumber ?? "0"
                    );
                  }}
                >
                  Gunakan
                </Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Bank
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      id={field.name}
                      options={bankOptions}
                      placeholder="bank"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Nomor Akun / Rekening
                  </FormLabel>
                  <FormDescription>
                    Pastikan nomor akun / rekening yang Anda masukkan sudah
                    benar.
                  </FormDescription>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="123456789"
                      disabled={isLoading}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Nama Akun / Rekening
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Azhmi Fauzi"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row items-center justify-end gap-3">
              <Button
                variant="primary"
                isLoading={isLoading}
                className="w-full md:w-auto"
                type="submit"
              >
                <Send />
                Ajukan
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
          {isFetching ? (
            <ReferralCardSkeleton />
          ) : (
            <>
              {referralCode && (
                <Alert variant="gradientPinkPurple">
                  Bagikan kode referral Anda agar pembeli mendapat potongan
                  harga&nbsp;
                  <span className="font-semibold">
                    {referralCode.isPercent
                      ? `${referralCode.discount}% dari harga awal`
                      : `${formatRupiah(Number(referralCode.discount))}`}
                  </span>
                  &nbsp;dan Anda memperoleh saldo&nbsp;
                  <span className="font-semibold">
                    {formatRupiah(Number(referralCode.referrerReward))}
                  </span>
                  . Penarikan dana hanya dapat dilakukan minimal&nbsp;
                  <span className="font-semibold">Rp 50.000</span>.
                </Alert>
              )}
              {!referralCode ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-app-primary/10">
                    <Gift className="w-6 h-6 text-green-app-primary" />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-muted-foreground">
                      Generate kode referral untuk akun baru Anda sekarang juga
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={generateReferral}
                      isGenerate={isLoading}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Generate Kode
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="w-full border border-gray-300 rounded-md shadow-sm">
                  <CardContent className="pt-3 sm:pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <Wallet className="text-gray-700 w-6 h-6" />
                        <div className="space-y-1">
                          <CardTitle className="text-gray-700 text-sm font-medium mb-1">
                            Total Saldo Tersisa
                          </CardTitle>
                          <p className="text-gray-900 text-2xl font-semibold tracking-tight leading-none">
                            {formatRupiah(
                              Number(balanceReferralCode?.availableBalance ?? 0)
                            )}
                          </p>

                          <p className="text-gray-600 text-sm">
                            Total Saldo Didapat:{" "}
                            <span className="font-medium text-gray-800">
                              {formatRupiah(
                                Number(balanceReferralCode?.totalReward ?? 0)
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <p className="text-gray-600 text-sm mb-1 sm:mb-0">
                          Kode Referral Anda
                        </p>
                        <Button
                          onClick={copyToClipboard}
                          className="inline-flex items-center gap-2 rounded-md bg-green-app-primary/10 px-3 py-1.5 text-green-app-primary font-semibold shadow-sm hover:bg-green-app-primary/30 transition select-none"
                          title="Klik untuk salin kode"
                          type="button"
                        >
                          <span>{referralCode.code}</span>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Tabs defaultValue="history" className="space-y-6">
            <TabsList
              className="flex w-full flex-col sm:flex-row bg-muted p-1"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 justify-center"
              >
                <History className="h-4 w-4" /> Riwayat
              </TabsTrigger>

              <TabsTrigger
                value="withdraw"
                className="flex items-center gap-2 justify-center"
              >
                <Wallet className="h-4 w-4" /> Penarikan Dana
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <TransactionDataTable
                columns={transactionColumns}
                data={referralCode?.transactions || []}
                isFetching={isFetching}
              />
            </TabsContent>
            <TabsContent value="withdraw">
              <WithdrawalDataTable
                columns={withdrawalColumns({
                  onProofClick: (id) => {
                    setWitdhrawal(
                      referralCode?.withdrawals.find((item) => item.id === id)
                    );
                    setIsModalPreviewImageOpen(true);
                  },
                })}
                data={referralCode?.withdrawals || []}
                disableSubmit={
                  Number(balanceReferralCode?.availableBalance ?? 0) < 10000 ||
                  referralCode?.withdrawals.some((w) => w.status === "PENDING")
                }
                isFetching={isFetching}
                onAddClick={() => setIsModalOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralCodeForm;
