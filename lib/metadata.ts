import { Metadata } from "next";
import { prisma } from "./prisma";

type Options = {
  slug?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export async function generatePageMetadata({
  slug,
  fallbackTitle = "Azen",
  fallbackDescription = "Undangan pernikahan digital modern dan elegan.",
}: Options): Promise<Metadata> {
  if (!slug) {
    return {
      title: `AZENI | ${fallbackTitle}`,
      description: fallbackDescription,
    };
  }

  try {
    const data = await prisma.invitation.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!data) throw new Error("Not Found");

    return {
      title: `${data.groom} & ${data.bride} - Undangan Pernikahan`,
      description: `Undangan pernikahan dari ${data.groom} dan ${data.bride}.`,
    };
  } catch {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }
}
