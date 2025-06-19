"use client";

import NavLink from "@/components/ui/nav-link";
import { UserButton, useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { AlignJustify, LayoutPanelLeft, Mail, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isLoaded } = useUser();
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const pathname = usePathname();
  const location = pathname.split("/")[2] || "";
  const handleCloseSidebar = () => {
    if (toggleSidebar) setToggleSidebar(false);
  };

  return (
    <>
      <div className="bg-slate-100 min-h-screen relative">
        <nav className="fixed top-0 bg-green-app-primary text-white w-full h-11 flex-center shadow z-40">
          <div className="w-full px-3 py-2 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <div
                  className="inline-flex items-center p-1.5 rounded-lg sm:hidden cursor-pointer hover:bg-white text-xl text-white hover:text-green-primary"
                  onClick={() => setToggleSidebar(!toggleSidebar)}
                >
                  <AlignJustify />
                </div>
                <Link href="/" className="text-lg font-medium tracking-wide">
                  AZEN
                </Link>
              </div>
              <div className="flex-center">
                {isLoaded ? (
                  <div className="w-7 h-7  rounded-full flex-center shadow">
                    <UserButton />
                  </div>
                ) : (
                  <div className="animate-pulse w-7 h-7 bg-gray-200 rounded-full" />
                )}
              </div>
            </div>
          </div>
        </nav>

        <aside
          id="logo-sidebar"
          className={clsx(
            "fixed top-11 pt-5 md:pt-3 left-0 z-30 w-64 h-screen transition-transform bg-white duration-700 -translate-x-full sm:translate-x-0 shadow",
            toggleSidebar ? "transform-none" : "-translate-x-full"
          )}
          aria-label="Sidebar"
          role="dialog"
          aria-modal={toggleSidebar}
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
            <ul className="space-y-1">
              <li>
                <NavLink
                  href="/dashboard"
                  active={location === ""}
                  onClick={() => setToggleSidebar(false)}
                >
                  <LayoutPanelLeft />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  href="/dashboard/invitation"
                  active={location === "invitation"}
                  onClick={() => setToggleSidebar(false)}
                >
                  <Mail />
                  Undangan
                </NavLink>
              </li>
              <li>
                <NavLink
                  href="/dashboard/payment"
                  active={location === "payment"}
                  onClick={() => setToggleSidebar(false)}
                >
                  <Wallet />
                  Transaksi
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <div
          className="p-3 pt-14 md:p-6 md:pt-16 sm:ml-64 min-h-screen "
          onClick={handleCloseSidebar}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
