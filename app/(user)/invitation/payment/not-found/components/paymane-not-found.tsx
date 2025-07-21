"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PaymentNotFoundContent: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="py-10 px-4">
        <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 max-w-xl mx-auto bg-white px-6 py-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-600 p-4 rounded-full">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Transaksi Tidak Ditemukan
          </h2>
          <p className="text-sm text-gray-600">
            Kami tidak dapat menemukan transaksi yang sesuai. Pastikan kamu
            menggunakan tautan yang benar atau cek daftar transaksi kamu.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="primary"
              onClick={() => router.push("/dashboard/invitation/new")}
            >
              Buat Undangan Baru
            </Button>
            <div>
              <Link
                href="/dashboard/payment"
                className="text-xs text-green-app-primary underline hover:text-green-app-secondary transition-colors"
              >
                Daftar Transaksi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentNotFoundContent;
