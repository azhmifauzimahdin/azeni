"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CreditCard, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { GiftService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { Invitation } from "@/types";
import useInvitationStore from "@/stores/invitation-store";
import axios from "axios";
import Modal from "@/components/ui/modal";
import Combobox from "@/components/ui/combobox";
import useUserBanks from "@/hooks/use-user-bank";
import Image from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import GiftCard from "./gift-card";

const formAddressSchema = z.object({
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
});

type GiftFormAddressValues = z.infer<typeof formAddressSchema>;

const formBankSchema = z.object({
  bankId: z.string().min(1, { message: "Bank wajib dipilih" }),
  accountNumber: z
    .string()
    .min(1, { message: "Nomor rekening wajib diisi" })
    .regex(/^\d+$/, { message: "Nomor rekening harus berupa angka" }),
  name: z.string().min(1, { message: "Nama wajib dipilih" }),
});

type GiftFormBankValues = z.infer<typeof formBankSchema>;

interface GiftFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const GiftForm: React.FC<GiftFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const { banks } = useUserBanks();

  const bankOptions = useMemo(() => {
    return banks.map((bank) => ({
      value: bank.id,
      label: (
        <span className="flex items-center gap-3">
          {bank.icon && (
            <Image
              src={bank.icon}
              alt="Logo Bank"
              aspectRatio="aspect-[3/1]"
              className="h-3"
              objectFit="h-full object-contain"
            />
          )}
          {bank.name}
        </span>
      ),
      searchText: bank.name,
    }));
  }, [banks]);

  const firstGift = useMemo(() => {
    return initialData?.bankaccounts?.find(
      (item) => item.bank?.name === "Kado"
    );
  }, [initialData]);

  const bankAccounts = useMemo(() => {
    return initialData?.bankaccounts?.filter(
      (item) => item.bank?.name !== "Kado"
    );
  }, [initialData]);

  const [loadingSubmitAddress, setLoadingSubmitAddress] = useState(false);
  const [loadingDeleteAddress, setLoadingDeleteAddress] = useState(false);
  const [loadingSubmitBank, setLoadingSubmitBank] = useState(false);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
  const [updatingBankId, setUpdatingBankId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const addOrUpdateBankAccountToInvitation = useInvitationStore(
    (state) => state.addOrUpdateBankAccountToInvitation
  );
  const deleteBankAccountFromInvitation = useInvitationStore(
    (state) => state.deleteBankAccountFromInvitation
  );

  const formAddress = useForm<GiftFormAddressValues>({
    resolver: zodResolver(formAddressSchema),
    defaultValues: {
      address: "",
    },
  });

  const formbank = useForm<GiftFormBankValues>({
    resolver: zodResolver(formBankSchema),
    defaultValues: {
      bankId: "",
    },
  });

  useEffect(() => {
    if (firstGift) {
      formAddress.reset({
        address: firstGift.name,
      });
    }
  }, [firstGift, formAddress]);

  const onSubmitAddress = async (data: GiftFormAddressValues) => {
    try {
      setLoadingSubmitAddress(true);
      let res;
      if (firstGift)
        res = await GiftService.updateAddress(params.id, firstGift.id, data);
      else res = await GiftService.createAddress(params.id, data);

      addOrUpdateBankAccountToInvitation(params.id, res);
      toast.success("Alamat berhasil disimpan.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Terjadi kesalahan saat menyimpan data.");
        } else {
          handleError(error, "address");
        }
      }
    } finally {
      setLoadingSubmitAddress(false);
    }
  };
  const onSubmitBank = async (data: GiftFormBankValues) => {
    try {
      setLoadingSubmitBank(true);
      let res;
      if (updatingBankId)
        res = await GiftService.updateBank(params.id, updatingBankId, data);
      else res = await GiftService.createBank(params.id, data);
      addOrUpdateBankAccountToInvitation(params.id, res);
      toast.success("Rekening berhasil disimpan.");
      setIsOpen(false);
      formbank.reset({
        bankId: "",
        accountNumber: "",
        name: "",
      });
      setUpdatingBankId(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Terjadi kesalahan saat menyimpan data.");
        } else {
          handleError(error, "bank");
        }
      }
    } finally {
      setLoadingSubmitBank(false);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      setLoadingDeleteAddress(true);
      if (firstGift?.id) {
        await GiftService.deleteAddress(params.id, firstGift.id);
      }
      toast.success("Alamat berhasil dihapus.");
      deleteBankAccountFromInvitation(params.id, firstGift?.id ?? "");
      formAddress.reset({
        address: "",
      });
    } catch (error: unknown) {
      handleError(error, "address");
    } finally {
      setLoadingDeleteAddress(false);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      setDeletingBankId(bankId);
      await GiftService.deleteAddress(params.id, bankId);
      toast.success("Rekening berhasil dihapus.");
      deleteBankAccountFromInvitation(params.id, bankId);
    } catch (error: unknown) {
      handleError(error, "bank");
    } finally {
      setDeletingBankId(null);
    }
  };

  const handleOpenModalEditBank = (id: string) => {
    setUpdatingBankId(id);
    setIsOpen(true);
    const bank = bankAccounts?.find((item) => item.id === id);
    formbank.reset({
      bankId: bank?.bank?.id,
      accountNumber: bank?.accountNumber,
      name: bank?.name,
    });
  };

  return (
    <>
      <Modal
        title="Tambah Nomor Rekening"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Form {...formbank}>
          <form
            onSubmit={formbank.handleSubmit(onSubmitBank)}
            className="space-y-4"
          >
            <FormField
              control={formbank.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Bank</FormLabel>
                  <FormControl>
                    <Combobox
                      options={bankOptions}
                      placeholder="bank"
                      disabled={loadingSubmitBank}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formbank.control}
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
                      disabled={loadingSubmitBank}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formbank.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} required>
                    Nomor Akun / Rekening
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="123456789"
                      disabled={loadingSubmitBank}
                      type="number"
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
                isLoading={loadingSubmitBank}
                className="w-full md:w-auto md:order-2"
                type="submit"
                isFetching={isFetching}
              >
                <Save /> Simpan
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-4 card-dashboard ">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-green-app-primary text-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-app-secondary"
          >
            <CreditCard size={32} />
            <span className="font-medium">Tambah Nomor Rekening</span>
          </div>
          <div className="text-base text-slate-600">
            {(bankAccounts ?? []).length > 0
              ? "Daftar Rekening"
              : "Belum ada rekening yang ditambahkan!"}
          </div>
          {isFetching
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border shadow-sm bg-white animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-sm" />
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-gray-200 rounded" />{" "}
                      <div className="h-3 w-36 bg-gray-100 rounded" />{" "}
                      <div className="h-3 w-32 bg-gray-100 rounded" />{" "}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />{" "}
                </div>
              ))
            : (bankAccounts ?? []).length > 0 && (
                <div className="space-y-2">
                  {bankAccounts?.map((bank) => (
                    <GiftCard
                      key={bank.id}
                      data={bank}
                      onClick={(id) => handleOpenModalEditBank(id)}
                      onDelete={() => handleDeleteBank(bank.id)}
                      isLoadingDelete={deletingBankId === bank.id}
                    />
                  ))}
                </div>
              )}
        </div>

        <div className=" card-dashboard">
          <h2 className="font-medium text-lg mb-1">Alamat Penerima Kado</h2>
          <div className="text-xs text-slate-600 mb-4">
            Tidak ingin menerima kiriman kado? Kosongkan saja form alamat ini
            demi menjaga privasi Anda.
          </div>
          <Form {...formAddress}>
            <form
              onSubmit={formAddress.handleSubmit(onSubmitAddress)}
              className="space-y-4"
            >
              <FormField
                control={formAddress.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Jl. Merpati No. 45, Gang Buntu, Depok 2"
                        disabled={loadingSubmitAddress}
                        className="h-44"
                        isFetching={isFetching}
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
                  isLoading={loadingSubmitAddress}
                  className="w-full md:w-auto md:order-2"
                  type="submit"
                  isFetching={isFetching}
                >
                  <Save /> Simpan
                </Button>
                {firstGift ? (
                  <Button
                    variant="destructive"
                    isLoading={loadingDeleteAddress}
                    disabled={loadingSubmitAddress || loadingDeleteAddress}
                    onClick={handleDeleteAddress}
                    className="w-full md:w-auto"
                    type="button"
                    isFetching={isFetching}
                  >
                    <Trash2 /> Hapus
                  </Button>
                ) : null}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default GiftForm;
