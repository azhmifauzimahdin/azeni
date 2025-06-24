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
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { GiftService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import { Invitation } from "@/types";
import useInvitationStore from "@/stores/invitation-store";
import axios from "axios";

const formSchema = z.object({
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
});

type GiftFormAddressValues = z.infer<typeof formSchema>;

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
  console.log(initialData);
  const firstGift = useMemo(() => {
    return initialData?.bankaccounts?.find(
      (item) => item.bank?.name === "Kado"
    );
  }, [initialData]);

  const [loadingSubmitAddress, setLoadingSubmitAddress] = useState(false);
  const [loadingDeleteAddress, setLoadingDeleteAddress] = useState(false);
  const addOrUpdateBankAccountToInvitation = useInvitationStore(
    (state) => state.addOrUpdateBankAccountToInvitation
  );
  const deleteBankAccountFromInvitation = useInvitationStore(
    (state) => state.deleteBankAccountFromInvitation
  );

  const formAddress = useForm<GiftFormAddressValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
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
      console.log(error);
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
      handleError(error, "quote");
    } finally {
      setLoadingDeleteAddress(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div className="space-y-4 card-dashboard ">
        <div
          role="button"
          tabIndex={0}
          // onClick={handleOpenModal} // ganti dengan fungsi modal kamu
          // onKeyDown={(e) => e.key === "Enter" && handleOpenModal()}
          className="flex items-center gap-3 bg-green-app-primary text-white rounded-lg shadow p-4 cursor-pointer hover:bg-green-app-secondary"
        >
          <CreditCard size={32} />
          <span className="font-medium">Tambah Nomor Rekening</span>
        </div>
        <div className="text-base text-slate-600">Daftar Rekening</div>
      </div>

      <div className=" card-dashboard">
        <h2 className="font-medium text-lg mb-1">Alamat Penerima Kado</h2>
        <div className="text-xs text-slate-600 mb-4">
          Tidak ingin menerima kiriman kado? Kosongkan saja form alamat ini demi
          menjaga privasi Anda.
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
  );
};

export default GiftForm;
