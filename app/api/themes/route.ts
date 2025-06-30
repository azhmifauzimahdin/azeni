import { prisma } from "@/lib/prisma";
import { ResponseJson } from "@/lib/utils/response-with-wib";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return ResponseJson("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, thumbnail, colorTag, originalPrice, discount } = body;

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Nama harus diisi." });
    if (!thumbnail)
      errors.push({ field: "thumbnail", message: "Thumbnail harus diisi." });
    if (!colorTag)
      errors.push({ field: "name", message: "Tag warna harus diisi." });
    if (!originalPrice)
      errors.push({ field: "originalPrice", message: "Harga harus diisi." });
    if (!discount)
      errors.push({ field: "discount", message: "Diskon harus diisi." });

    if (errors.length > 0) {
      return ResponseJson({ errors }, { status: 400 });
    }

    const newTheme = await prisma.theme.create({
      data: { name, thumbnail, colorTag, originalPrice, discount },
    });

    return ResponseJson(newTheme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme:", error);
    return ResponseJson({ message: "Gagal membuat tema." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
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

    if (!themes || themes.length === 0) {
      return ResponseJson({ message: "Tema tidak ditemukan" }, { status: 404 });
    }

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

    return ResponseJson(result);
  } catch (error) {
    console.error("Error getting themes:", error);
    return ResponseJson(
      { message: "Gagal mengambil data tema" },
      { status: 500 }
    );
  }
}
