import { generatePageMetadata } from "@/lib/metadata";
import DashboardContent from "./components/dashboard-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Dashboard" });

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardContent />
    </div>
  );
}
