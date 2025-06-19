import { generatePageMetadata } from "@/lib/metadata";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Dashboard" });

export default function DashbordsPage() {
  return <div>Dashboard</div>;
}
