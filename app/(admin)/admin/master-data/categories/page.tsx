import { generatePageMetadata } from "@/lib/metadata";
import ThemeCategoryContent from "./components/theme-category-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Kategori Tema" });

export default function BankPage() {
  return (
    <div className="space-y-4">
      <ThemeCategoryContent />
    </div>
  );
}
