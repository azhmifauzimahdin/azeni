/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function generateUniqueSlug(
  title: string,
  modelName: keyof PrismaClient,
  slugField: string = "slug"
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;

  const model = (prisma as any)[modelName];
  if (!model) {
    throw new Error(
      `Model ${String(modelName)} tidak ditemukan di Prisma client`
    );
  }

  const now = new Date();

  const similarSlugs = await model.findMany({
    where: {
      [slugField]: {
        startsWith: baseSlug,
      },
      expiresAt: {
        gt: now,
      },
    },
    select: {
      [slugField]: true,
    },
  });

  if (!similarSlugs.some((s: any) => s[slugField] === baseSlug)) {
    return baseSlug;
  }

  const suffixes = similarSlugs
    .map((item: any) => {
      const match = item[slugField].match(new RegExp(`^${baseSlug}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num: number) => num !== 0);

  const nextNumber = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;

  slug = `${baseSlug}-${nextNumber}`;
  return slug;
}
