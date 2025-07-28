import { CloudinaryDeleteResponse, CloudinaryUnusedResponse } from "@/types";
import httpRequest from "./api";

export async function fetchImages(): Promise<CloudinaryUnusedResponse> {
  const res = await httpRequest.get("/api/cloudinary/cleanup-cloudinary");
  return res.data;
}
export async function deleteImages(): Promise<CloudinaryDeleteResponse> {
  const res = await httpRequest.post("/api/cloudinary/cleanup-cloudinary");
  return res.data;
}
