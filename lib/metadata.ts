import { Metadata } from "next";
import { prisma } from "./prisma";

type Options = {
  slug?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export async function generatePageMetadata({
  slug,
  fallbackTitle = process.env.NEXT_PUBLIC_BRAND_NAME,
  fallbackDescription = "Undangan pernikahan digital modern dan elegan.",
}: Options = {}): Promise<Metadata> {
  if (!slug?.trim()) {
    return {
      title: `${process.env.NEXT_PUBLIC_BRAND_NAME} | ${fallbackTitle}`,
      description: fallbackDescription,
    };
  }

  try {
    const data = await prisma.invitation.findFirst({
      where: {
        slug,
      },
    });

    if (!data) throw new Error("Not Found");

    if (data.isTemplate) {
      return {
        title: `${
          data.slug.charAt(0).toUpperCase() + data.slug.slice(1)
        } | Undangan Pernikahan`,
        description: `Undangan pernikahan dari ${data.groom} dan ${data.bride}.`,
      };
    }

    return {
      title: `${data.groom} & ${data.bride} - Undangan Pernikahan`,
      description: `Undangan pernikahan dari ${data.groom} dan ${data.bride}.`,
    };
  } catch {
    return {
      title: `${process.env.NEXT_PUBLIC_BRAND_NAME} | ${fallbackTitle}`,
      description: fallbackDescription,
    };
  }
}
