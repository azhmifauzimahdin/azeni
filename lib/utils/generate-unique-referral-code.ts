import { prisma } from "@/lib/prisma";

function generateAzenCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AZEN-${suffix}`;
}

export async function generateUniqueReferralCode(): Promise<string> {
  let isUnique = false;
  let code = "";

  while (!isUnique) {
    code = generateAzenCode();
    const existing = await prisma.guest.findUnique({ where: { code } });
    if (!existing) isUnique = true;
  }

  return code;
}
