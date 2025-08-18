import Link from "next/link";
import { cn } from "@/lib/utils"; // helper untuk merge class (opsional)

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface BottomNavbarProps {
  navLinks: NavLink[];
  wrapperClassName?: string; // custom wrapper style
  linkClassName?: string; // custom link style
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  navLinks,
  wrapperClassName,
  linkClassName,
}) => {
  return (
    <div className="fixed bottom-5 right-1/2 sm:right-0 transform translate-x-1/2 sm:translate-x-0 z-40 w-auto sm:w-[390px] flex justify-center">
      <div
        className={cn(
          "flex justify-center gap-3 px-3 py-2 w-auto rounded-lg shadow-xl",
          wrapperClassName ?? "bg-slate-100"
        )}
      >
        {navLinks.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "p-2 rounded-lg",
              linkClassName ??
                "bg-green-primary hover:bg-green-secondary text-white"
            )}
          >
            {icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
