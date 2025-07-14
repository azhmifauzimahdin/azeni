/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ImageService } from "@/lib/services";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import ImageComponent from "@/components/ui/image";
import { ImageSchema } from "@/lib/schemas";
import heic2any from "heic2any";
import { FILE_TRANFORMATION } from "@/lib/schemas/image";

interface ImageUploadProps {
  id?: string;
  isLoadingUpload?: boolean;
  isLoadingDelete?: boolean;
  disabled?: boolean;
  isFetching?: boolean;
  onChange: (value: string) => void;
  onRemove: (publicId: string) => void;
  value: string;
  path: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  isLoadingUpload,
  isLoadingDelete,
  disabled,
  isFetching,
  onChange,
  onRemove,
  value,
  path,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewAspectRatio, setPreviewAspectRatio] = useState<
    string | undefined
  >(undefined);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (value && !previewAspectRatio) {
      const img = new window.Image();
      img.onload = () => {
        const ratio = `${img.width} / ${img.height}`;
        setPreviewAspectRatio(ratio);
      };
      img.src = value;
    }
  }, [value, previewAspectRatio]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    const result = ImageSchema.imageSchema.safeParse(file);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setIsConverting(false);
      return;
    }

    let finalFile = file;

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const isHeicLike =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      (!file.type && (fileExt === "heic" || fileExt === "heif"));

    if (isHeicLike) {
      try {
        const output = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.95,
        });
        const blob = Array.isArray(output) ? output[0] : output;
        finalFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
          type: "image/jpeg",
        });
      } catch (err) {
        console.error("Konversi HEIC gagal:", err);
        toast.error("Gagal mengkonversi gambar HEIC.");
        setIsConverting(false);
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      setPreviewUrl(imageUrl);
      setUploadProgress(0);

      const img = new window.Image();
      img.onload = () => {
        const ratio = `${img.width} / ${img.height}`;
        setPreviewAspectRatio(ratio);
      };
      img.src = imageUrl;

      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = path || "default";

        const res = await ImageService.getSignature({
          timestamp: timestamp.toString(),
          folder,
          transformation: FILE_TRANFORMATION,
        });

        const { signature } = res.data;

        const uploadRes = await ImageService.uploadImageToCloudinary(
          {
            file: finalFile,
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
            timestamp: timestamp.toString(),
            signature,
            folder,
            transformation: FILE_TRANFORMATION,
          },
          (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          }
        );

        onChange(uploadRes.secure_url);
      } catch (err) {
        toast.error("Terjadi kesalahan saat mengupload foto.");
        console.error(err);
      } finally {
        setUploadProgress(null);
        setPreviewUrl(null);
        setIsConverting(false);
      }
    };

    reader.readAsDataURL(finalFile);
    e.target.value = "";
  };

  const handleClick = () => {
    if (!isLoadingUpload) fileInputRef.current?.click();
  };

  const handleRemove = () => {
    const publicId = extractCloudinaryPublicId(value);
    if (publicId) {
      onRemove(publicId);
      setUploadProgress(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        id={id}
      />

      {isConverting && !previewUrl ? (
        <div
          className="relative max-w-[150px]"
          style={{ aspectRatio: previewAspectRatio ?? "1 / 1" }}
        >
          <div className="w-full h-full rounded-md overflow-hidden relative bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-app-primary" />
            </div>
          </div>
        </div>
      ) : value ? (
        <div
          className="relative max-w-[150px]"
          style={{ aspectRatio: previewAspectRatio ?? "1 / 1" }}
        >
          <div className="relative">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <ImageComponent
                src={value}
                alt="Foto"
                isFetching={isFetching}
                objectFit="object-contain"
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <Button
              variant="delete"
              size="icon"
              type="button"
              onClick={handleRemove}
              isLoading={isLoadingDelete}
              disabled={isLoadingUpload || isLoadingDelete || disabled}
              isFetching={isFetching}
              className="absolute -top-3 -right-3 z-10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Hapus foto</span>
            </Button>
          </div>
        </div>
      ) : previewUrl ? (
        <div
          className="relative max-w-[150px]"
          style={{ aspectRatio: previewAspectRatio ?? "1 / 1" }}
        >
          <div className="w-full h-full rounded-md overflow-hidden relative bg-gray-100">
            <ImageComponent
              src={previewUrl}
              alt="Uploading..."
              className="w-full h-full object-contain rounded-md opacity-70"
            />
            {isConverting && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-app-primary" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="bg-gradient-pink-purple h-full transition-all duration-300"
                style={{ width: `${uploadProgress ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={handleClick}
          isLoading={isLoadingUpload}
          disabled={isLoadingUpload || isLoadingDelete || disabled}
          className="w-auto"
          isFetching={isFetching}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
