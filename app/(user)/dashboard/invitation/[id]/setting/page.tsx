import { generatePageMetadata } from "@/lib/metadata";
import SettingContent from "./components/setting-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Pengaturan" });

interface SettingProps {
  params: {
    id: string;
  };
}

export default function SettingPage({ params }: SettingProps) {
  return (
    <div className="space-y-4">
      <SettingContent params={params} />
    </div>
  );
}
