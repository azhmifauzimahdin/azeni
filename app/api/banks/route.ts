import { prisma } from "@/lib/prisma";
import { BankSchema } from "@/lib/schemas";
import {
  forbiddenError,
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const bank = await prisma.bank.findMany({
      where: {
        name: { not: "Kado" },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResponseJson(
      {
        message: "Data bank berhasil diambil",
        data: bank,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil data bank");
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "admin") return forbiddenError();

    const body = await req.json();
    const parsed = BankSchema.bankSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { name, icon } = parsed.data;

    const bank = await prisma.bank.create({
      data: {
        name,
        icon,
      },
    });

    return ResponseJson(
      {
        message: "Data bank berhasil dibuat",
        data: bank,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat data bank");
  }
}
