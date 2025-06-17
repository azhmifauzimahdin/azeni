import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";

export interface OptionNavlink {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
}

interface NavLinkDropdownProps {
  options: OptionNavlink[];
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const NavLinkDropdown: FC<NavLinkDropdownProps> = (props) => {
  const { children, options, onClick, className } = props;
  const [toggle, setToogle] = useState<boolean>(
    options.some((data: OptionNavlink) => data.active === true)
  );

  useEffect(() => {
    const result = options.some((data: OptionNavlink) => data.active === true);
    setToogle(result);
  }, [options]);

  return (
    <div>
      <div
        onClick={() => {
          setToogle(!toggle);
          onClick();
        }}
        className={clsx(
          "text-slate-800 cursor-pointer flex items-center gap-3 p-3 rounded-lg group relative",
          toggle ? "bg-slate-100" : "",
          className
        )}
      >
        {children}
        <ChevronLeft
          size={16}
          className={clsx(
            "absolute text-slate-500 right-2 transition-all delay-100 ",
            toggle ? "-rotate-90" : ""
          )}
        />
      </div>
      <AnimatePresence initial={false}>
        {toggle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="overflow-hidden space-y-1 ps-3 py-2"
          >
            {options.map((data: OptionNavlink, index) => (
              <Link
                key={index}
                href={data.href}
                className={clsx(
                  "flex items-center gap-3 p-2.5 rounded-lg text-slate-800",
                  data.active
                    ? "text-white bg-green-app-primary hover:bg-green-app-secondary"
                    : "hover:text-green-app-primary"
                )}
              >
                {data.icon}
                {data.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavLinkDropdown;
