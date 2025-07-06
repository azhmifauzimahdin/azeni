import { CoupleRequest, Couple } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function createCouple(
  invitationId: string,
  request: CoupleRequest
): Promise<ApiResponse<Couple>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/couple`,
    request
  );

  return res.data;
}

export async function updateCoupleImage(
  invitationId: string,
  request: { field: string; url: string }
): Promise<ApiResponse<Couple>> {
  const res = await httpRequest.post(
    `/api/invitations/${invitationId}/couple/image`,
    request
  );

  return res.data;
}
export async function deleteCoupleImage(
  invitationId: string,
  field: string
): Promise<ApiResponse<Couple>> {
  const res = await httpRequest.delete(
    `/api/invitations/${invitationId}/couple/image/${field}`
  );

  return res.data;
}
