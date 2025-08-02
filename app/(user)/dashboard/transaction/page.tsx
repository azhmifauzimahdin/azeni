import PaymentContent from "./components/payment-content";
import { generatePageMetadata } from "@/lib/metadata";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Transaksi" });

export default function PaymentPage() {
  return (
    <div className="space-y-4">
      <PaymentContent />
    </div>
  );
}
