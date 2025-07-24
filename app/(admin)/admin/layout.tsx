import AdminPageLayout from "./components/admin-page-layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminPageLayout>{children}</AdminPageLayout>
    </>
  );
}
