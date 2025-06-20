import httpRequest from "./api";

export async function deleteImageByPublicId(public_id: string) {
  const res = await httpRequest.delete(`/api/image/`, {
    data: { public_id: public_id },
  });
  return res.data;
}
