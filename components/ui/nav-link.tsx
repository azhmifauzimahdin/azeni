import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface NavLinkProps {
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavLink: FC<NavLinkProps> = ({
  href = "",
  icon,
  label,
  onClick,
  className,
  active,
  collapsed,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={clsx(
      "flex items-center px-3 py-2 rounded-md group transition-colors",
      collapsed ? "justify-center" : "gap-3",
      active
        ? "text-white bg-green-app-primary hover:bg-green-app-secondary"
        : "text-slate-800 hover:text-green-app-primary",
      className
    )}
  >
    <span className="text-base">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </Link>
);

export default NavLink;
