"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function NotFound() {
  return (
    <main className="h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <Mail className="mx-auto w-20 h-20 text-green-app-primary mb-4" />
        <p className="text-gray-600 text-base mb-6">
          Undangan yang Anda cari tidak ditemukan atau mungkin sedang dalam
          proses disiapkan.
        </p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Muat Ulang Halaman
        </Button>
      </div>
    </main>
  );
}
