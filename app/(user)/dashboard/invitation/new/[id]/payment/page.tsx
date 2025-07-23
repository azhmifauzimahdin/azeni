import { generatePageMetadata } from "@/lib/metadata";
import InvitationPaymentForm from "./components/invitation-payment-form";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pembayaran" });

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  return (
    <div>
      <InvitationPaymentForm params={params} />
    </div>
  );
}
