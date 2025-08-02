import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <SignIn />
      <Link
        href="/"
        className="flex items-center justify-center gap-1 text-sm font-medium text-green-app-primary hover:underline transition-colors mt-3"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
