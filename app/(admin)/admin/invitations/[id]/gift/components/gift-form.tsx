"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CreditCard, Pencil, Save, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import GiftCard from "./gift-card";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { createBankAccountSchema } from "@/lib/schemas/bank-account";
import { Pagination } from "@/components/ui/pagination";
import { Img } from "@/components/ui/Img";

const formAddressSchema = z.object({
  address: z
    .string({
      required_error: "Alamat wajib diisi",
      invalid_type_error: "Alamat harus berupa string",
    })
    .min(1, { message: "Alamat tidak boleh kosong" }),
});

type GiftFormAddressValues = z.infer<typeof formAddressSchema>;

type GiftFormBankValues = z.infer<typeof createBankAccountSchema>;

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
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );
  const [loadingSubmitBank, setLoadingSubmitBank] = useState(false);
  const [loadingDeleteBank, setLoadingDeleteBank] = useState(false);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
  const [deletingBankName, setDeletingBankName] = useState<string | null>(null);
  const [updatingBankId, setUpdatingBankId] = useState<string | null>(null);
  const [isModalDeleteBankOpen, setIsModalDeleteBankOpen] = useState(false);
  const [isModalDeleteAddressOpen, setIsModalDeleteAddressOpen] =
    useState(false);
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
    resolver: zodResolver(createBankAccountSchema),
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

      addOrUpdateBankAccountToInvitation(params.id, res.data);
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
      addOrUpdateBankAccountToInvitation(params.id, res.data);
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

  const onDelete = async () => {
    try {
      if (deletingBankId) {
        setLoadingDeleteBank(true);
        await GiftService.deleteAddress(params.id, deletingBankId);
        toast.success("Rekening berhasil dihapus.");
        deleteBankAccountFromInvitation(params.id, deletingBankId);
      } else if (deletingAddressId) {
        setLoadingDeleteAddress(true);
        if (firstGift?.id) {
          await GiftService.deleteAddress(params.id, firstGift.id);
        }
        toast.success("Alamat berhasil dihapus.");
        deleteBankAccountFromInvitation(params.id, firstGift?.id ?? "");
        formAddress.reset({
          address: "",
        });
      }
    } catch (error: unknown) {
      handleError(error, "bankAccount");
    } finally {
      setLoadingDeleteBank(false);
      setLoadingDeleteAddress(false);
      setDeletingAddressId(null);
      setDeletingBankId(null);
      setDeletingBankName(null);
    }
  };

  const bankAccountsPerPage = 10;
  const totalPages = Math.ceil(
    (bankAccounts || []).length / bankAccountsPerPage
  );
  const [currentPage, setCurrentPage] = useState(1);

  const currentbankAccounts = (bankAccounts || []).slice(
    (currentPage - 1) * bankAccountsPerPage,
    currentPage * bankAccountsPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <Modal
        title={`${updatingBankId ? "Ubah" : "Tambah"} Nomor Rekening`}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          if (updatingBankId) {
            formbank.reset({
              bankId: "",
              accountNumber: "",
              name: "",
            });
            setUpdatingBankId(null);
          }
        }}
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
                  <FormLabel htmlFor={field.name} required>
                    Bank
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      id={field.name}
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
                {updatingBankId ? (
                  <>
                    <Pencil />
                    Ubah
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
      <DeleteConfirmationModal
        description={
          isModalDeleteBankOpen
            ? `nomor rekening a.n ${deletingBankName}`
            : "alamat"
        }
        isOpen={isModalDeleteBankOpen || isModalDeleteAddressOpen}
        onOpenChange={() => {
          setDeletingBankId(null);
          setDeletingBankName(null);
          setIsModalDeleteBankOpen(false);
          setDeletingAddressId(null);
          setIsModalDeleteAddressOpen(false);
        }}
        onConfirm={onDelete}
        loading={loadingDeleteBank || loadingDeleteAddress}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-4 card-dashboard ">
          {isFetching ? (
            <div className="flex items-center gap-3 bg-muted text-muted-foreground rounded-lg shadow p-4 max-w-md animate-pulse">
              <div className="w-8 h-8 bg-skeleton rounded" />
              <div className="h-4 w-40 bg-skeleton rounded" />
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 bg-green-app-primary text-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-app-secondary"
            >
              <CreditCard size={32} />
              <span className="font-medium">Tambah Nomor Rekening</span>
            </div>
          )}
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
            : (currentbankAccounts ?? []).length > 0 && (
                <div className="space-y-2">
                  {currentbankAccounts?.map((bank) => (
                    <GiftCard
                      key={bank.id}
                      data={bank}
                      onClick={(id) => handleOpenModalEditBank(id)}
                      onDelete={(id: string, name: string) => {
                        setDeletingBankId(id);
                        setDeletingBankName(name);
                        setIsModalDeleteBankOpen(true);
                      }}
                      isLoadingDelete={deletingBankId === bank.id}
                    />
                  ))}
                </div>
              )}
          {totalPages > 1 && (
            <div className="mt-8 flex-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                siblingCount={1}
              />
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
                    isLoading={deletingAddressId ? true : false}
                    disabled={loadingSubmitAddress || loadingDeleteAddress}
                    onClick={() => {
                      setDeletingAddressId(firstGift?.id);
                      setIsModalDeleteAddressOpen(true);
                    }}
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
