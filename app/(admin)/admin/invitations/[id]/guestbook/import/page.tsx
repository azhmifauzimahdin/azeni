import { generatePageMetadata } from "@/lib/metadata";
import ImportGuestBookContent from "./components/import-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Import Tamu" });

interface ImportGuestBookProps {
  params: {
    id: string;
  };
}

export default function ImportGuestBookPage({ params }: ImportGuestBookProps) {
  return (
    <div className="space-y-4">
      <ImportGuestBookContent params={params} />
    </div>
  );
}
