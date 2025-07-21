"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("transaction_status");

    if (status === "settlement") {
      router.replace(`/dashboard/invitation?order=${orderId}`);
    } else {
      router.replace(`/payment/failed`);
    }
  }, [router, searchParams]);

  return <div className="p-10 text-center">Mengalihkan...</div>;
}
