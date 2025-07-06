import { Music } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchMusics(): Promise<ApiResponse<Music[]>> {
  const res = await httpRequest.get("/api/musics");
  return res.data;
}
