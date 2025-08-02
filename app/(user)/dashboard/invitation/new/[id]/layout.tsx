import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

const statusCodeByStatusName: Record<string, string> = {
  PENDING: "201",
  SUCCESS: "200",
  FAILED: "202",
  EXPIRED: "202",
  CANCELLED: "202",
  REFUNDED: "200",
};

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
    },
    include: {
      transaction: {
        include: {
          status: true,
        },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const query = headersList.get("x-invoke-query") || "";

  const isCheckoutRoute = pathname.includes(
    `/dashboard/invitation/new/${params.id}/checkout`
  );

  if (isCheckoutRoute) {
    if (invitation.transaction?.status.name !== "CREATED") {
      redirect(
        `/dashboard/invitation/new/${params.id}/payment?order_id=${
          invitation.transaction?.orderId
        }&status_code=${
          statusCodeByStatusName[
            invitation.transaction?.status.name || "PENDING"
          ]
        }&transaction_status=${invitation.transaction?.status.name.toLowerCase()}`
      );
    }
  }

  const isPaymentRoute = pathname.includes(
    `/dashboard/invitation/new/${params.id}/payment`
  );

  if (isPaymentRoute) {
    if (invitation.transaction?.status.name === "CREATED") {
      redirect("checkout");
    }
    const searchParams = new URLSearchParams(query);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      notFound();
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        orderId,
        invitationId: params.id,
      },
    });

    if (!transaction) {
      notFound();
    }
  }

  return <>{children}</>;
}
