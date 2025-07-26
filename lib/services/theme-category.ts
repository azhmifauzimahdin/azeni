import { CategoryTheme, CategoryThemeRequest } from "@/types";
import httpRequest, { ApiResponse } from "./api";

export async function fetchThemeCategories(): Promise<
  ApiResponse<CategoryTheme[]>
> {
  const res = await httpRequest.get("/api/theme-categories");
  return res.data;
}
export async function createThemeCategory(
  request: CategoryThemeRequest
): Promise<ApiResponse<CategoryTheme>> {
  const res = await httpRequest.post("/api/theme-categories", request);
  return res.data;
}
export async function updateThemeCategory(
  themeCategoryId: string,
  request: CategoryThemeRequest
): Promise<ApiResponse<CategoryTheme>> {
  const res = await httpRequest.put(
    `/api/theme-categories/${themeCategoryId}`,
    request
  );
  return res.data;
}
export async function deleteThemeCategory(
  themeCategoryId: string
): Promise<ApiResponse<CategoryTheme>> {
  const res = await httpRequest.delete(
    `/api/theme-categories/${themeCategoryId}`
  );
  return res.data;
}
