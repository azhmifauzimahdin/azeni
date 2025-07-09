import { prisma } from "../prisma";

function generateCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${num}${suffix}`;
}

export async function generateUniqueGuestCode(): Promise<string> {
  let isUnique = false;
  let code = "";

  while (!isUnique) {
    code = generateCode();
    const existing = await prisma.guest.findUnique({ where: { code } });
    if (!existing) isUnique = true;
  }

  return code;
}
