import { generatePageMetadata } from "@/lib/metadata";
import TransactionsContent from "./components/transactions-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Transaksi" });

export default function BankPage() {
  return (
    <div className="space-y-4">
      <TransactionsContent />
    </div>
  );
}
