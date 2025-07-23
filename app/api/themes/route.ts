import { prisma } from "@/lib/prisma";
import { ThemeSchema } from "@/lib/schemas";
import {
  handleError,
  handleZodError,
  ResponseJson,
  unauthorizedError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

    const body = await req.json();
    const parsed = ThemeSchema.createThemeSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const {
      name,
      thumbnail,
      colorTag,
      originalPrice,
      categoryId,
      discount,
      isPercent,
    } = parsed.data;

    const themeCategory = await prisma.themeCategory.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!themeCategory) {
      return ResponseJson(
        {
          message: "Kategori tema tidak ditemukan",
          errors: {
            categoriId: ["Kategori tema dengan ID tersebut tidak tersedia"],
          },
        },
        { status: 404 }
      );
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        thumbnail,
        categoryId,
        colorTag,
        originalPrice,
        discount,
        isPercent,
      },
    });

    return ResponseJson(
      {
        message: "Tema berhasil dibuat",
        data: theme,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal membuat tema");
  }
}

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        category: true,
        invitations: {
          include: {
            guests: {
              take: 1,
              where: { name: "tamu" },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    const result = themes.map((theme) => {
      const matchingInvitation = theme.invitations.find(
        (inv) => inv.slug === theme.name
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { invitations, ...themeWithoutInvitations } = theme;

      if (!matchingInvitation) {
        return {
          ...themeWithoutInvitations,
          invitation: null,
        };
      }

      const { guests, ...invitationWithoutGuests } = matchingInvitation;

      return {
        ...themeWithoutInvitations,
        invitation: {
          ...invitationWithoutGuests,
          guest: guests?.[0] ?? null,
        },
      };
    });

    return ResponseJson(
      {
        message: "Data tema berhasil diambil",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengambil tema");
  }
}
