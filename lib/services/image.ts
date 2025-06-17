import axios from "axios";

export async function deleteImageByPublicId(public_id: string) {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/`,
    { data: { public_id: public_id } }
  );
  return res.data;
}
