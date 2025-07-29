import { generatePageMetadata } from "@/lib/metadata";
import ThemeContent from "./components/theme-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Tema" });

interface ThemePageProps {
  params: {
    id: string;
  };
}

export default function ThemePage({ params }: ThemePageProps) {
  return (
    <div className="space-y-4">
      <ThemeContent params={params} />
    </div>
  );
}
