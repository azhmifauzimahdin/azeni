export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full sm:w-[390px] min-h-screen bg-white shadow-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
}
