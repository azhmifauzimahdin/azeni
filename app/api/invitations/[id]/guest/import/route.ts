import { prisma } from "@/lib/prisma";
import { generateUniqueGuestCode } from "@/lib/utils/generate-unique-guest-code";
import { getRandomBgColor } from "@/lib/utils/random-bg-color";
import {
  forbiddenError,
  handleError,
  ResponseJson,
  unauthorizedError,
  unpaidInvitationError,
} from "@/lib/utils/response";
import { auth } from "@clerk/nextjs/server";
import { read, utils } from "xlsx";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorizedError();

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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return ResponseJson(
        {
          message: "Validasi gagal",
          errors: {
            file: ["File Excel wajib diunggah"],
          },
        },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        transaction: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invitation) return forbiddenError();
    const transactionStatus = invitation.transaction?.status?.name;
    if (transactionStatus !== "SUCCESS") {
      return unpaidInvitationError();
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json(sheet);

    const guestsToCreate = rows
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((row: any) => {
        const name = row["Nama"]?.toString().trim();
        if (!name) return null;

        return {
          name,
          group: row["Grup"]?.toString().trim() || null,
          address: row["Alamat"]?.toString().trim() || null,
        };
      })
      .filter(Boolean);

    const createdGuests = [];

    for (const guestData of guestsToCreate) {
      const code = await generateUniqueGuestCode();
      const color = getRandomBgColor();

      const guest = await prisma.guest.create({
        data: {
          code,
          invitationId: params.id,
          name: guestData!.name,
          group: guestData!.group,
          address: guestData!.address,
          color,
        },
      });

      createdGuests.push(guest);
    }

    const existingInvitationChange = await prisma.invitationChange.findFirst({
      where: {
        invitationId: params.id,
        type: "guest",
      },
    });

    if (!existingInvitationChange) {
      await prisma.invitationChange.create({
        data: {
          invitationId: params.id,
          type: "guest",
        },
      });
    }

    return ResponseJson(
      {
        message: "Data tamu berhasil diimpor",
        data: createdGuests,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Gagal mengimpor tamu");
  }
}
