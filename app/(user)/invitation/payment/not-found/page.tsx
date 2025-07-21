import { generatePageMetadata } from "@/lib/metadata";
import PaymentNotFoundContent from "./components/paymane-not-found";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Transaksi Tidak Ditemukan" });

export default function PaymentNotFoundPage() {
  return (
    <div>
      <PaymentNotFoundContent />
    </div>
  );
}
