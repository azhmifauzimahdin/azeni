import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function NewInvitationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: params.id,
      userId: userId,
      transaction: {
        status: {
          name: "SUCCESS",
        },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  return <>{children}</>;
}
