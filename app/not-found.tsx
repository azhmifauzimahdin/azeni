import { LinkButton } from "@/components/ui/link";

export default function NotFound() {
  return (
    <main className="h-[calc(var(--vh)_*_100)] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-semibold text-green-app-primary mb-2">
          404
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Halaman yang Anda cari tidak ditemukan.
        </p>
        <LinkButton
          href="/"
          className="bg-green-app-primary hover:bg-green-app-primary/90 text-white"
        >
          Kembali ke Beranda
        </LinkButton>
      </div>
    </main>
  );
}
