"use client";

import { Bank, ReferralCode } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import Modal from "@/components/ui/modal";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CreditCard, Pencil, Save, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ReferralCodeService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import useAdminReferralCodeStore from "@/stores/admin-referral-store";
import {
  referralCodeFormSchema,
  referralWithdrawalFormSchema,
} from "@/lib/schemas/referral-code";
import { Textarea } from "@/components/ui/textarea";
import { columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Img } from "@/components/ui/Img";
import Combobox from "@/components/ui/combobox";
import { useAdminReferralWithdrawalStore } from "@/stores/admin-referral-withdrawal-store";

type ReferralCodeFormValues = z.infer<typeof referralCodeFormSchema>;
type ReferralWithdrawalFormValues = z.infer<
  ReturnType<typeof referralWithdrawalFormSchema>
>;

interface ReferralCodesFormProps {
  initialData: ReferralCode[] | undefined;
  banks: Bank[] | undefined;
  isFetching?: boolean;
}

const ReferralCodesForm: React.FC<ReferralCodesFormProps> = ({
  initialData,
  banks,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalWithdrawalOpen, setIsModalWithdrawalOpen] =
    useState<boolean>(false);
  const [updatingReferralCodeId, setUpdatingReferralCodeId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<ReferralCode | undefined>(
    undefined
  );

  const upsertReferralCodeAtFirst = useAdminReferralCodeStore(
    (state) => state.upsertReferralCodeAtFirst
  );
  const upsertWithdrawalToReferralCode = useAdminReferralCodeStore(
    (state) => state.upsertWithdrawalToReferralCode
  );

  const upsertReferralWithdrawalAtFirst = useAdminReferralWithdrawalStore(
    (state) => state.upsertReferralWithdrawalAtFirst
  );

  const form = useForm<ReferralCodeFormValues>({
    resolver: zodResolver(referralCodeFormSchema),
    defaultValues: {
      userName: "",
      code: "",
      description: "",
      discount: "0",
      isPercent: false,
      maxDiscount: "0",
      referrerReward: "0",
      referrerIsPercent: false,
      isActive: true,
    },
  });

  const isPercent = form.watch("isPercent");
  const referrerIsPercent = form.watch("referrerIsPercent");

  const onSubmit = async (data: ReferralCodeFormValues) => {
    try {
      setIsLoading(true);
      let res;
      if (updatingReferralCodeId)
        res = await ReferralCodeService.updateReferralCode(
          updatingReferralCodeId,
          data
        );
      else res = await ReferralCodeService.createReferralCode(data);
      upsertReferralCodeAtFirst(res.data);
      if (updatingReferralCodeId)
        toast.success("Kode referral berhasil diubah.");
      else toast.success("Kode referral berhasil disimpan.");
      setIsModalOpen(false);
      form.reset({
        userName: "",
        code: "",
        description: "",
        discount: "0",
        isPercent: false,
        maxDiscount: "0",
        referrerReward: "0",
        referrerIsPercent: false,
        isActive: true,
      });
      setUpdatingReferralCodeId(null);
    } catch (error: unknown) {
      handleError(error, "Referral Code");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModalEdit = (id: string) => {
    setUpdatingReferralCodeId(id);
    setIsModalOpen(true);
    const referralCode = initialData?.find((item) => item.id === id);
    form.reset({
      userName: referralCode?.userName ?? "",
      code: referralCode?.code,
      description: referralCode?.description ?? "",
      discount: referralCode?.discount.toString() ?? "0",
      isPercent: referralCode?.isPercent,
      maxDiscount: referralCode?.maxDiscount?.toString() ?? "0",
      referrerReward: referralCode?.referrerReward?.toString() ?? "0",
      referrerIsPercent: referralCode?.referrerIsPercent,
      isActive: referralCode?.isActive,
    });
  };

  const onOpenModalWithdrawal = (id: string) => {
    const referralCode = initialData?.find((item) => item.id === id);
    setReferralCode(referralCode);
    setUpdatingReferralCodeId(id);
    setIsModalWithdrawalOpen(true);
  };

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

  const formWithdrawal = useForm<ReferralWithdrawalFormValues>({
    resolver: zodResolver(
      referralWithdrawalFormSchema(
        10000,
        Number(referralCode?.balance.availableBalance ?? 0)
      )
    ),
    defaultValues: {
      amount: "0",
      bankId: "",
      accountNumber: "",
      name: "",
    },
  });

  const onSubmitWithdrawal = async (data: ReferralWithdrawalFormValues) => {
    try {
      if (!updatingReferralCodeId) return;
      setIsLoading(true);
      const res = await ReferralCodeService.createReferralCodeWithdrawalById(
        updatingReferralCodeId,
        data
      );
      upsertReferralWithdrawalAtFirst(res.data);
      upsertWithdrawalToReferralCode(updatingReferralCodeId, res.data);
      toast.success("Permohonan penarikan dana berhasil diajukan.");
      formWithdrawal.reset({
        amount: "0",
        bankId: "",
        accountNumber: "",
        name: "",
      });
      setIsModalWithdrawalOpen(false);
    } catch (error) {
      handleError(error, "create referral code withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={`${updatingReferralCodeId ? "Ubah" : "Tambah"} Kode Referral`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (updatingReferralCodeId) {
            form.reset({
              code: "",
              description: "",
              discount: "0",
              isPercent: false,
              maxDiscount: "0",
              isActive: true,
            });
            setUpdatingReferralCodeId(null);
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Nama User
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="Azhmi Fauzi Mahdin"
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Kode
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="NIKAHFLAT20"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Deskripsi
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Dapatkan potongan harga langsung sebesar Rp10.000"
                      className="h-44"
                      disabled={isLoading}
                      isFetching={isFetching}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Jenis Diskon
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? "percent" : "flat"}
                      onValueChange={(val) => field.onChange(val === "percent")}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis diskon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat (Rp)</SelectItem>
                        <SelectItem value="percent">Persen (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Pilih apakah diskon berupa nominal atau persen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Diskon
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type={isPercent ? "percent" : "currency"}
                      placeholder={isPercent ? "10" : "20000"}
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
              name="maxDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Maksimal Diskon</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type="currency"
                      placeholder="20000"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan angka 0 jika tidak ingin membatasi maksimal diskon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referrerIsPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Jenis Reward
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? "percent" : "flat"}
                      onValueChange={(val) => field.onChange(val === "percent")}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis reward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat (Rp)</SelectItem>
                        <SelectItem value="percent">Persen (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Pilih apakah reward berupa nominal atau persen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referrerReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required htmlFor={field.name}>
                    Reward
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type={referrerIsPercent ? "percent" : "currency"}
                      placeholder={referrerIsPercent ? "10" : "20000"}
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel htmlFor={field.name}>Aktifkan Kode</FormLabel>
                    <FormDescription>
                      Jika dinonaktifkan, pengguna tidak bisa memakai kode ini.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
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
                {updatingReferralCodeId ? (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Ubah
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      <Modal
        title={`Penarikan Dana - ${referralCode?.code}`}
        isOpen={isModalWithdrawalOpen}
        onClose={() => {
          setIsModalWithdrawalOpen(false);
        }}
      >
        <Form {...formWithdrawal}>
          <form
            onSubmit={formWithdrawal.handleSubmit(onSubmitWithdrawal)}
            className="space-y-4"
          >
            <FormField
              control={formWithdrawal.control}
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
                    formWithdrawal.setValue(
                      "bankId",
                      referralCode?.withdrawals[0].bank.id ?? ""
                    );
                    formWithdrawal.setValue(
                      "name",
                      referralCode?.withdrawals[0].name ?? ""
                    );
                    formWithdrawal.setValue(
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
              control={formWithdrawal.control}
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
              control={formWithdrawal.control}
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
              control={formWithdrawal.control}
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

      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onEdit: (id) => onOpenModalEdit(id),
              onWithdrawal: (id) => onOpenModalWithdrawal(id),
            })}
            data={initialData || []}
            isFetching={isFetching}
            onAddClick={() => setIsModalOpen(true)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralCodesForm;
