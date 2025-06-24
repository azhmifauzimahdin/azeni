import { Metadata } from "next";

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitation/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Not Found");
    const data = await res.json();

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
