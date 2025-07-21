export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center px-2 h-[calc(var(--vh)_*_100)] relative">
      {children}
    </div>
  );
}
