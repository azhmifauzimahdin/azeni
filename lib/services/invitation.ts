import { Invitation } from "@/types";
import axios from "axios";

export async function fetchInvitationByslug(slug: string): Promise<Invitation> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${slug}`
  );
  return res.data;
}
