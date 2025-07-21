import crypto from "crypto";

export function generateOrderId() {
  const now = new Date();

  const timestamp = now
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 17);

  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `INV-${timestamp}-${random}`;
}
