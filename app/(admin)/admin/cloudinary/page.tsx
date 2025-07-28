import { generatePageMetadata } from "@/lib/metadata";
import CloudinaryContent from "./components/cloudinary-content";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Cloudinary" });

export default function CloudinaryPage() {
  return (
    <div className="space-y-4">
      <CloudinaryContent />
    </div>
  );
}
