import { Music, MusicRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchMusics(): Promise<ApiResponse<Music[]>> {
  const res = await httpRequest.get("/api/musics");
  return res.data;
}
export async function fetchActiveMusics(): Promise<ApiResponse<Music[]>> {
  const res = await httpRequest.get("/api/musics/active");
  return res.data;
}
export async function createMusics(
  request: MusicRequest
): Promise<ApiResponse<Music>> {
  const res = await httpRequest.post("/api/musics", request);
  return res.data;
}
export async function updateMusics(
  musicId: string,
  request: MusicRequest
): Promise<ApiResponse<Music>> {
  const res = await httpRequest.put(`/api/musics/${musicId}`, request);
  return res.data;
}
export async function deleteMusics(
  musicId: string
): Promise<ApiResponse<Music>> {
  const res = await httpRequest.delete(`/api/musics/${musicId}`);
  return res.data;
}
