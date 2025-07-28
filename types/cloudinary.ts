export interface CloudinaryUnusedResponse {
  success: boolean;
  mode: "preview";
  deletedCount: number;
  totalCloudinary: number;
  totalUsedInDB: number;
  unusedResources: CloudinaryUnusedResource[];
}

export interface CloudinaryUnusedResource {
  public_id: string;
  secure_url: string;
}

export interface CloudinaryDeleteResponse {
  success: boolean;
  mode: "delete";
  deleted: Record<string, "deleted" | "not_found">;
  deletedCount: number;
  totalCloudinary: number;
  totalUsedInDB: number;
}
