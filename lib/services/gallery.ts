import httpRequest from "./api";

export async function createGallery(
  invitationId: string,
  request: {
    image: string;
    description?: string;
  }
) {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/galleries`,
    request
  );
  return res.data;
}

export async function deleteGallery(invitationId: string, galleryId: string) {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/galleries/${galleryId}`
  );
  return res.data;
}
