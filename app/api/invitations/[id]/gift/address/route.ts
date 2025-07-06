import { prisma } from "@/lib/prisma";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const addressSchema = z.object({
  address: z
    .string({
      required_error: "Alamat wajib diisi",
      invalid_type_error: "Alamat harus berupa teks",
    })
    .min(5, { message: "Alamat terlalu pendek, minimal 5 karakter" })
    .max(255, { message: "Alamat terlalu panjang, maksimal 255 karakter" }),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    if (!params.id) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            id: ["ID wajib diisi"],
          },
        },
        { status: 400 }
      );
    }

    const { address } = parsed.data;

    const invitationByUserId = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!invitationByUserId) return forbiddenError();

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
        {
          message: "Gagal membuat alamat.",
          errors: {
            address: ["Alamat kado sudah tersedia."],
          },
        },
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
        {
          message: "Bank tidak ditemukan",
          errors: {
            bank: ["Bank dengan ID atau nama tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        invitationId: params.id,
        bankId: bank?.id,
        accountNumber: "XXXXX",
        name: address,
      },
      include: {
        bank: true,
      },
    });

    return ResponseJson(
      {
        message: "Alamat berhasil dibuat",
        data: bankAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat alamat");
  }
}
