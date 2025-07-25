"use client";

import { ReferralCode } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import Modal from "@/components/ui/modal";
import { useState } from "react";
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
import { Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ReferralCodeService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import useAdminReferralCodeStore from "@/stores/admin-referral-store";
import { referralCodeFormSchema } from "@/lib/schemas/referral-code";
import { Textarea } from "@/components/ui/textarea";
import { columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReferralCodeFormValues = z.infer<typeof referralCodeFormSchema>;

interface ReferralCodesFormProps {
  initialData: ReferralCode[] | undefined;
  isFetching?: boolean;
}

const ReferralCodesForm: React.FC<ReferralCodesFormProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatingReferralCodeId, setUpdatingReferralCodeId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const upsertReferralCodeAtFirst = useAdminReferralCodeStore(
    (state) => state.upsertReferralCodeAtFirst
  );

  const form = useForm<ReferralCodeFormValues>({
    resolver: zodResolver(referralCodeFormSchema),
    defaultValues: {
      code: "",
      description: "",
      discount: "0",
      isPercent: false,
      maxDiscount: "0",
      isActive: true,
    },
  });

  const isPercent = form.watch("isPercent");

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
        code: "",
        description: "",
        discount: "0",
        isPercent: false,
        maxDiscount: "0",
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
      code: referralCode?.code,
      description: referralCode?.description ?? "",
      discount: referralCode?.discount.toString() ?? "0",
      isPercent: referralCode?.isPercent,
      maxDiscount: referralCode?.maxDiscount?.toString() ?? "0",
      isActive: referralCode?.isActive,
    });
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
                  <FormLabel htmlFor={field.name}>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="Diskon langsung Rp20.000"
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

      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onEdit: (id) => onOpenModalEdit(id),
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
