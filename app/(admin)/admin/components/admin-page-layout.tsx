"use client";

import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/Img";
import NavLink from "@/components/ui/nav-link";
import NavLinkDropdown from "@/components/ui/nav-link-dropdown";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlignJustify,
  CloudUpload,
  CreditCard,
  Database,
  Layers,
  LayoutPanelLeft,
  Mail,
  Music4,
  Palette,
  Quote,
  Ticket,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const AdminPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isLoaded } = useUser();
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const pathname = usePathname();
  const segments = pathname.split("/");
  const location = [segments[2], segments[3]].filter(Boolean).join("/");

  const handleCloseSidebar = () => {
    if (toggleSidebar) setToggleSidebar(false);
  };

  return (
    <>
      <div className="min-h-[calc(var(--vh)_*_100)] relative">
        <nav className="fixed top-0 bg-green-app-primary text-white w-full h-11 flex-center shadow z-40">
          <div className="w-full px-3 py-2 md:ps-[0.95rem] md:pe-6 ">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setToggleSidebar(!toggleSidebar)}
              >
                <AlignJustify />
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex md:items-center"
                  onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                >
                  <AlignJustify size={32} />
                </Button>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-lg font-medium tracking-wide"
                >
                  <div className="bg-[#33B3B3] p-1 rounded-tl-lg rounded-bl-sm rounded-br-lg rounded-tr-sm">
                    <Img
                      src="https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751291122/azen-white-b_rzbq1g.png"
                      alt="Logo"
                      wrapperClassName="w-4 h-4"
                      sizes="16px"
                      priority
                    />
                  </div>
                  <div className="pt-0.5 font-gallery font-medium">
                    {process.env.NEXT_PUBLIC_BRAND_NAME}
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
            "fixed top-11 pt-3 md:pt-3 left-0 z-30 transition-all duration-300 bg-white shadow h-[calc(var(--vh)_*_100)]",
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
                  href="/admin"
                  icon={<LayoutPanelLeft />}
                  label="Dashboard"
                  active={location === ""}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setToggleSidebar(false)}
                />
              </li>
              <li>
                <NavLink
                  href="/admin/transactions"
                  icon={<Wallet />}
                  label="Transaksi"
                  active={location.includes("transactions")}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setToggleSidebar(false)}
                />
              </li>
              <li>
                <NavLink
                  href="/admin/invitations"
                  icon={<Mail />}
                  label="Undangan"
                  active={location.includes("invitations")}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setToggleSidebar(false)}
                />
              </li>
              <li>
                <NavLink
                  href="/admin/referral-code"
                  icon={<Ticket />}
                  label="Referral"
                  active={location.includes("referral-code")}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setToggleSidebar(false)}
                />
              </li>
              <li>
                <NavLink
                  href="/admin/cloudinary"
                  icon={<CloudUpload />}
                  label="Cloudinary"
                  active={location.includes("cloudinary")}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setToggleSidebar(false)}
                />
              </li>
              <ul>
                <NavLinkDropdown
                  icon={<Database />}
                  label="Master Data"
                  onClick={() => setToggleSidebar(false)}
                  onExpandSidebar={() => setIsSidebarCollapsed(false)}
                  collapsed={isSidebarCollapsed}
                  options={[
                    {
                      href: "/admin/master-data/categories",
                      label: "Kategori",
                      icon: <Layers />,
                      active: location.includes("master-data/categories"),
                    },
                    {
                      href: "/admin/master-data/banks",
                      label: "Bank",
                      icon: <CreditCard />,
                      active: location.includes("master-data/banks"),
                    },
                    {
                      href: "/admin/master-data/musics",
                      label: "Musik",
                      icon: <Music4 />,
                      active: location.includes("master-data/musics"),
                    },
                    {
                      href: "/admin/master-data/quotes",
                      label: "Quote",
                      icon: <Quote />,
                      active: location.includes("master-data/quotes"),
                    },
                    {
                      href: "/admin/master-data/themes",
                      label: "Tema",
                      icon: <Palette />,
                      active: location.includes("master-data/themes"),
                    },
                  ]}
                />
              </ul>
            </ul>
          </div>
        </aside>

        <div
          className={cn(
            "p-3 pt-14 pb-16 md:p-6 md:pt-14 transition-all duration-300",
            isSidebarCollapsed ? "sm:ml-16" : "sm:ml-64"
          )}
          onClick={handleCloseSidebar}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminPageLayout;
