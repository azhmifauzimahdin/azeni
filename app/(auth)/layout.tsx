export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-center h-[calc(var(--vh)_*_100)]">{children}</div>
  );
}
