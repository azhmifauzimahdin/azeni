import { generatePageMetadata } from "@/lib/metadata";
import AdminContent from "./components/admin-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Dashboard" });

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AdminContent />
    </div>
  );
}
