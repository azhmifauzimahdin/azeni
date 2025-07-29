import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function NewInvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  return <>{children}</>;
}
