"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Invitation } from "@/types";
import { applyReferralSchema } from "@/lib/schemas/transaction";
import { Img } from "@/components/ui/Img";

const InvitationCheckoutCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-xl mx-auto border shadow-md overflow-hidden mt-8 animate-pulse">
      <div className="bg-muted p-6 space-y-2">
        <div className="h-6 w-1/3 bg-gray-300 rounded mx-auto" />
        <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto" />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-24 h-16 bg-gray-300 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-4 w-1/4 bg-gray-300 rounded" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-gray-300 rounded" />
            <div className="h-10 w-24 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="h-4 w-1/3 bg-gray-300 rounded" />

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-1/4 bg-gray-300 rounded" />
            <div className="h-4 w-1/4 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-1/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/5 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between border-t pt-3">
            <div className="h-5 w-1/3 bg-gray-300 rounded" />
            <div className="h-5 w-1/4 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
    </Card>
  );
};

type ReferralFormValues = z.infer<typeof applyReferralSchema>;

interface InvitationCheckoutCardProps {
  invitation: Invitation | undefined;
  onApplyReferral: (code: string) => void;
  onCheckout: () => void;
  isApplyingReferral?: boolean;
  isDeletingReferral?: boolean;
  isCheckingOut?: boolean;
  isFetching?: boolean;
}

const InvitationCheckoutCard: React.FC<InvitationCheckoutCardProps> = ({
  invitation,
  onApplyReferral,
  onCheckout,
  isApplyingReferral,
  isDeletingReferral,
  isCheckingOut,
  isFetching,
}) => {
  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(applyReferralSchema),
    defaultValues: {
      referralCode: "",
    },
  });

  if (
    isFetching ||
    !invitation ||
    !invitation.theme ||
    !invitation.transaction
  ) {
    return <InvitationCheckoutCardSkeleton />;
  }

  const theme = invitation.theme;
  const transaction = invitation.transaction;

  const originalPrice = Number(theme.originalPrice);
  const themeDiscount = Number(theme.discount ?? 0);
  const isPercent = theme.isPercent;

  const themeDiscountAmount = isPercent
    ? (themeDiscount / 100) * originalPrice
    : themeDiscount;

  const afterThemeDiscount = originalPrice - themeDiscountAmount;

  const referralDiscount = Number(transaction.referralDiscountAmount ?? 0);
  const finalPrice = afterThemeDiscount - referralDiscount;

  const hasThemeDiscount = themeDiscount > 0;
  const hasReferralDiscount = referralDiscount > 0;

  const format = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);

  return (
    <Card className="w-full max-w-xl mx-auto border shadow-md overflow-hidden mt-8">
      <CardHeader className="bg-muted p-6">
        <CardTitle className="text-2xl font-semibold text-center">
          Detail Pesanan
        </CardTitle>
        <p className="text-muted-foreground text-center">
          <strong>{invitation.groom}</strong> &&nbsp;
          <strong>{invitation.bride}</strong>
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex gap-4">
          <Img
            src={theme.thumbnail}
            alt={theme.name}
            wrapperClassName="relative w-24 h-24 rounded-md overflow-hidden border"
            sizes="96px"
            className="object-cover"
          />
          <div>
            <p className="font-medium">{theme.name}</p>
            <div className="text-sm text-muted-foreground">
              {hasThemeDiscount ? (
                <>
                  <p className="line-through">{format(originalPrice)}</p>
                  <p className="text-foreground font-semibold">
                    {format(afterThemeDiscount)}
                  </p>
                  <p className="text-green-app-primary text-xs">
                    Diskon Tema: -{format(themeDiscountAmount)}
                  </p>
                </>
              ) : (
                <p className="text-foreground font-semibold">
                  {format(originalPrice)}
                </p>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const code = values.referralCode?.trim() ?? "";
              onApplyReferral(code);
            })}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor={field.name}>
                    Kode Referral (opsional)
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Masukkan kode referral"
                        disabled={isApplyingReferral || isCheckingOut}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="outline"
                      isLoading={isApplyingReferral}
                      disabled={
                        isApplyingReferral ||
                        isDeletingReferral ||
                        isCheckingOut
                      }
                    >
                      Terapkan
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {hasReferralDiscount && (
          <div className="space-y-1 text-sm text-green-app-primary">
            <div className="flex items-center justify-between">
              <div>
                Kode referral&nbsp;
                <span className="font-semibold">
                  {transaction.referralCode.code}
                </span>
                &nbsp;telah diterapkan.
              </div>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  form.reset();
                  onApplyReferral("");
                }}
                isLoading={isDeletingReferral}
                disabled={
                  isDeletingReferral || isApplyingReferral || isCheckingOut
                }
                className="text-red-500 hover:bg-red-50 px-2"
              >
                Hapus
              </Button>
            </div>

            {transaction.referralCode.description && (
              <p className="text-xs text-muted-foreground">
                {transaction.referralCode.description}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Harga Tema</span>
            <span>{format(originalPrice)}</span>
          </div>
          {hasThemeDiscount && (
            <div className="flex justify-between text-sm text-green-app-primary">
              <span>Diskon Tema</span>
              <span>-{format(themeDiscountAmount)}</span>
            </div>
          )}
          {hasReferralDiscount && (
            <div className="flex justify-between text-sm text-green-app-primary">
              <span>Diskon Referral</span>
              <span>-{format(referralDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-3">
            <span>Total Bayar</span>
            <span>{format(finalPrice)}</span>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={onCheckout}
          className="w-full"
          isLoading={isCheckingOut}
          disabled={isCheckingOut || isApplyingReferral || isDeletingReferral}
        >
          Lanjut ke Pembayaran
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvitationCheckoutCard;
