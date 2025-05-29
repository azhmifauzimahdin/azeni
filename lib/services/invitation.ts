import axios from "axios";

export async function fetchInvitationByname(name: string) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/${name}`
  );
  return res.data;
}
