import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";

export interface OptionNavlink {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
}

interface NavLinkDropdownProps {
  icon: ReactNode;
  label: string;
  options: OptionNavlink[];
  onClick?: () => void;
  onExpandSidebar?: () => void;
  className?: string;
  collapsed?: boolean;
}

const NavLinkDropdown: FC<NavLinkDropdownProps> = ({
  icon,
  label,
  options,
  onClick,
  onExpandSidebar,
  className,
  collapsed = false,
}) => {
  const [toggle, setToggle] = useState<boolean>(
    options.some((data) => data.active)
  );

  useEffect(() => {
    if (collapsed) {
      setToggle(false);
    } else {
      const result = options.some((data) => data.active);
      setToggle(result);
    }
  }, [collapsed, options]);

  const isAnyOptionActive = options.some((data) => data.active);
  const showGreen = collapsed && isAnyOptionActive;
  const showGray = !collapsed && (toggle || isAnyOptionActive);

  return (
    <div>
      <div
        onClick={() => {
          if (!collapsed) {
            setToggle(!toggle);
          } else {
            onExpandSidebar?.();
          }
        }}
        className={cn(
          "cursor-pointer flex items-center px-3 py-2 rounded-md group relative transition-colors",
          collapsed ? "justify-center" : "gap-3",
          showGreen
            ? "bg-green-app-primary text-white"
            : showGray
            ? "bg-slate-100 text-slate-900 hover:text-green-app-primary"
            : "text-slate-800 hover:text-green-app-primary",
          className
        )}
      >
        <span
          className={cn(
            "text-base",
            showGreen ? "text-white" : "text-green-app-primary"
          )}
        >
          {icon}
        </span>
        {!collapsed && (
          <span className="truncate transition-all duration-300 ease-in-out min-w-0">
            {label}
          </span>
        )}
        {!collapsed && (
          <ChevronUp
            size={16}
            className={cn(
              "absolute right-2 text-slate-500 transition-transform",
              toggle ? "-rotate-180" : ""
            )}
          />
        )}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && toggle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-1 py-1"
          >
            {options.map((data, index) => (
              <Link
                key={index}
                href={data.href}
                onClick={() => onClick?.()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  data.active
                    ? "text-white bg-green-app-primary hover:bg-green-app-secondary"
                    : "hover:text-green-app-primary text-slate-800"
                )}
              >
                <span
                  className={cn(
                    "text-base",
                    data.active ? "text-white" : "text-green-app-primary"
                  )}
                >
                  {data.icon}
                </span>
                <span>{data.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavLinkDropdown;
