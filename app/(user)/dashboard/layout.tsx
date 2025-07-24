import DashboardLayout from "./components/dashboard";

export default function InvitationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
