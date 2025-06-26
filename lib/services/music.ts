import { Music } from "@/types";
import httpRequest from "./api";

export async function fetchMusics(): Promise<Music[]> {
  const res = await httpRequest.get("/api/musics");
  return res.data;
}
