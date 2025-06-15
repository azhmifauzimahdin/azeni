export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-center h-screen">{children}</div>;
}
