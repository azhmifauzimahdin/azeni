export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-center min-h-screen h-[calc(var(--vh)_*_100)]">
      {children}
    </div>
  );
}
