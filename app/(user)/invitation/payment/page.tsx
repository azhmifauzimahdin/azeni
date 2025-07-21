import { generatePageMetadata } from "@/lib/metadata";
import PaymentContent from "./components/payment-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pembayaran" });

export default function PaymentPage() {
  return (
    <div>
      <PaymentContent />
    </div>
  );
}
