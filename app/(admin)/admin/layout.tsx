import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminPageLayout from "./components/admin-page-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const role = (user.publicMetadata as { role?: string })?.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <>
      <AdminPageLayout>{children}</AdminPageLayout>
    </>
  );
}
