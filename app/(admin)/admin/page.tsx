import { generatePageMetadata } from "@/lib/metadata";
import AdminContent from "./components/admin-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Dashboard" });

export default function DashboardPage() {
  return (
    <>
      <AdminContent />
    </>
  );
}
