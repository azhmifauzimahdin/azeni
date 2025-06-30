import { Theme } from "@/types";
import httpRequest from "./api";

export async function fetchThemes(): Promise<Theme[]> {
  const res = await httpRequest.get("/api/themes");
  return res.data;
}
