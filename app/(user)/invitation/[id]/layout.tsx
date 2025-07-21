export default function InvitationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-[calc(var(--vh)_*_100)] relative">{children}</div>;
}
