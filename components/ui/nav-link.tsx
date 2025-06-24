import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface NavLinkProps {
  href?: string;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  active?: boolean;
}

const NavLink: FC<NavLinkProps> = (props) => {
  const { href = "", children, onClick, className, active } = props;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 text-slate-800 rounded-md group",
        active
          ? "text-white bg-green-app-primary hover:bg-green-app-secondary"
          : "hover:text-green-app-primary",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
