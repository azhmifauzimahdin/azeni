import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NavigationBackProps {
  href: string;
}

const NavigationBack: React.FC<NavigationBackProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="flex text-green-app-primary gap-3 font-medium hover:text-green-app-secondary"
    >
      <ArrowLeft /> Kembali
    </Link>
  );
};

export default NavigationBack;
