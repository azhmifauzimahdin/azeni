import { prisma } from "@/lib/prisma";
import { ReferralSchema } from "@/lib/schemas";
import {
  ResponseJson,
  forbiddenError,
  handleError,
  handleZodError,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = ReferralSchema.updateWithdrawalStatusSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }
    const { status, transferProofUrl, note } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return ResponseJson({ message: "Status tidak valid" }, { status: 400 });
    }

    const withdrawal = await prisma.referralWithdrawal.update({
      where: { id: params.id },
      data: {
        status,
        transferProofUrl: status === "APPROVED" ? transferProofUrl : undefined,
        note: status === "REJECTED" ? note : undefined,
        processedAt: new Date(),
      },
      include: { bank: true, referralCode: true },
    });

    return ResponseJson({
      message: `Penarikan berhasil di${
        status === "APPROVED" ? "setujui" : "tolak"
      }`,
      data: withdrawal,
    });
  } catch (error) {
    return handleError(error, "Gagal memproses penarikan");
  }
}
