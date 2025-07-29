import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function InvitationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: params.id,
      userId: user.id,
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

  return (
    <div className="min-h-[calc(var(--vh)_*_100)] relative">{children}</div>
  );
}
