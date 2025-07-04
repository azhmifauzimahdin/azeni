import crypto from "crypto";

export function getFolderFromInvitationId(invitationId: string): string {
  return crypto
    .createHash("sha256")
    .update(invitationId)
    .digest("hex")
    .slice(0, 12);
}
