import { prisma } from "@/lib/prisma";

function generateAzenCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const num = Math.floor(1000 + Math.random() * 9000);
  return `AZEN-${num}${suffix}`;
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
