import { ImageTemplate } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchImageTemplates(): Promise<
  ApiResponse<ImageTemplate[]>
> {
  const res = await httpRequest.get("/api/image-templates");
  return res.data;
}
