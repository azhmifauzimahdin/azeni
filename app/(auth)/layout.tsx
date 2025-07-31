export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-center min-h-[calc(var(--vh)_*_100)] p-3">
      {children}
    </div>
  );
}
