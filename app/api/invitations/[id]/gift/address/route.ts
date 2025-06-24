import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { address } = body;

    const errors = [];
    if (!address)
      errors.push({ field: "address", message: "Alamat harus diisi." });
    if (!params.id)
      errors.push({
        field: "invitationId",
        message: "Invitation ID harus diisi.",
      });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId)
      return ResponseJson("Unauthorized", { status: 401 });

    const gift = await prisma.bankAccount.findFirst({
      where: {
        invitationId: params.id,
        bank: {
          name: "Kado",
        },
      },
    });

    if (gift) {
      return ResponseJson(
        { message: "Gagal membuat alamat." },
        { status: 409 }
      );
    }

    const bank = await prisma.bank.findFirst({
      where: {
        name: "Kado",
      },
    });

    if (!bank) {
      return ResponseJson(
        { message: "Kado ID tidak ditemukan" },
        { status: 404 }
      );
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        invitationId: params.id,
        bankId: bank?.id,
        nomor: "XXXXX",
        name: address,
      },
      include: {
        bank: true,
      },
    });

    return ResponseJson(bankAccount, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return ResponseJson({ message: "Gagal membuat alamat." }, { status: 500 });
  }
}
