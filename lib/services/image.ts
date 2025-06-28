/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosProgressEvent } from "axios";
import httpRequest from "./api";

export async function deleteImageByPublicId(public_id: string) {
  const res = await httpRequest.delete(`/api/image/`, {
    data: { public_id: public_id },
  });
  return res.data;
}

export async function getSignature(paramsToSign: {
  timestamp: string;
  folder: string;
}) {
  const res = await httpRequest.post("/api/image", {
    paramsToSign,
  });
  return res.data;
}

export interface UploadImageRequest {
  file: File | Blob;
  api_key: string;
  timestamp: string;
  signature: string;
  folder?: string;
}

export interface UploadImageResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  [key: string]: any;
}

export async function uploadImageToCloudinary(
  data: UploadImageRequest,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("api_key", data.api_key);
  formData.append("timestamp", data.timestamp);
  formData.append("signature", data.signature);
  if (data.folder) formData.append("folder", data.folder);

  const res = await axios.post<UploadImageResponse>(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );

  return res.data;
}
