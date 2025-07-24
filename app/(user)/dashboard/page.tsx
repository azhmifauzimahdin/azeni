import { generatePageMetadata } from "@/lib/metadata";
import DashboardContent from "./components/dashboard-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Dashboard" });

export default function DashboardPage() {
  return (
    <>
      <DashboardContent />
    </>
  );
}
