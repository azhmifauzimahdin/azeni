"use client";

import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import NavLink from "@/components/ui/nav-link";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlignJustify,
  LayoutPanelLeft,
  Mail,
  Ticket,
  Wallet,
} from "lucide-react";
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const pathname = usePathname();
  const location = pathname.split("/")[2] || "";
  const handleCloseSidebar = () => {
    if (toggleSidebar) setToggleSidebar(false);
  };

  return (
    <>
      <div className="min-h-[calc(var(--vh)_*_100)] overflow-y-auto overscroll-contain relative">
        <nav className="fixed top-0 bg-green-app-primary text-white w-full h-11 flex-center shadow z-40">
          <div className="w-full px-3 py-2 md:ps-[0.95rem] md:pe-6 ">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => {
                  setToggleSidebar(!toggleSidebar);
                  setIsSidebarCollapsed(false);
                }}
              >
                <AlignJustify />
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex sm:items-center"
                  onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                >
                  <AlignJustify size={32} />
                </Button>
                <Link
                  href="/"
                  className="flex items-center text-lg font-medium tracking-wide"
                >
                  <Img
                    src="/assets/img/azen-white.png"
                    alt="sample"
                    wrapperClassName="w-[1.04rem] h-[1.04rem]"
                    sizes="300px"
                    priority
                  />
                  <div className="pt-0.5 font-medium">
                    {(process.env.NEXT_PUBLIC_BRAND_NAME ?? "").slice(1)}
                  </div>
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
          className={cn(
            "fixed top-11 pt-3 md:pt-3 left-0 z-30 transition-all duration-300 bg-white shadow min-h-[calc(var(--vh)_*_100)]",
            toggleSidebar
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0",
            isSidebarCollapsed ? "w-16" : "w-64"
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
                  icon={<LayoutPanelLeft />}
                  label="Dashboard"
                  active={location === ""}
                  collapsed={isSidebarCollapsed}
                  onClick={() => {
                    setToggleSidebar(false);
                    setIsSidebarCollapsed(true);
                  }}
                />
              </li>
              <li>
                <NavLink
                  href="/dashboard/invitation"
                  icon={<Mail />}
                  label="Undangan"
                  active={location === "invitation"}
                  collapsed={isSidebarCollapsed}
                  onClick={() => {
                    setToggleSidebar(false);
                    setIsSidebarCollapsed(true);
                  }}
                />
              </li>
              <li>
                <NavLink
                  href="/dashboard/transaction"
                  icon={<Wallet />}
                  label="Transaksi"
                  active={location === "transaction"}
                  collapsed={isSidebarCollapsed}
                  onClick={() => {
                    setToggleSidebar(false);
                    setIsSidebarCollapsed(true);
                  }}
                />
              </li>
              <li>
                <NavLink
                  href="/dashboard/referral-code"
                  icon={<Ticket />}
                  label="Referral"
                  active={location.includes("referral-code")}
                  collapsed={isSidebarCollapsed}
                  onClick={() => {
                    setToggleSidebar(false);
                    setIsSidebarCollapsed(true);
                  }}
                />
              </li>
            </ul>
          </div>
        </aside>

        <div
          className={cn(
            "px-3 pt-14 pb-16 md:p-6 md:pt-14 transition-all duration-300 min-h-screen",
            isSidebarCollapsed ? "sm:ml-16" : "sm:ml-64"
          )}
          onClick={handleCloseSidebar}
        >
          {children}
        </div>
        <div
          className={cn(
            "transition-all duration-300 border-t py-4 px-6 text-xs text-muted-foreground",
            isSidebarCollapsed ? "sm:ml-16" : "sm:ml-64"
          )}
        >
          ©&nbsp;
          {2025 === new Date().getFullYear()
            ? 2025
            : `2025 - ${new Date().getFullYear()}`}
          &nbsp;
          <strong>{process.env.NEXT_PUBLIC_BRAND_NAME}</strong>. All rights
          reserved.
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
