/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import Modal from "@/components/ui/modal";
import { ImageSchema } from "@/lib/schemas";
import { ImageService } from "@/lib/services";
import getCroppedImg from "@/lib/utils/crop-image";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import { ImagePlus, X } from "lucide-react";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>("image/jpeg");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!isLoadingUpload) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const result = ImageSchema.imageSchema.safeParse(file);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setFileMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setUploadProgress(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropComplete = useCallback((_cropped: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await uploadCroppedImage();
  };

  const uploadCroppedImage = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);
      if (!imageSrc) return;

      const blob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        fileMimeType
      );
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = path || "default";

      const res = await ImageService.getSignature({
        timestamp: timestamp.toString(),
        folder,
      });

      const { signature } = res.data;

      const uploadRes = await ImageService.uploadImageToCloudinary(
        {
          file: blob,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          timestamp: timestamp.toString(),
          signature,
          folder,
        },
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      onChange(uploadRes.secure_url);
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengupload foto.");
      console.error(err);
    } finally {
      setUploading(false);
      setIsOpen(false);
    }
  };

  const handleRemove = () => {
    const publicId = extractCloudinaryPublicId(value);
    if (publicId) {
      onRemove(publicId);
      setUploadProgress(null);
    }
  };

  const [cropperReady, setCropperReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setCropperReady(true);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setCropperReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && cropperReady) {
      const timeout = setTimeout(() => {
        uploadButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, cropperReady]);

  return (
    <>
      <Modal
        title="Upload Foto"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocusRef={uploadButtonRef}
      >
        {imageSrc && (
          <form onSubmit={handleSubmit}>
            <div className="relative w-full aspect-square bg-gray-200 rounded-sm overflow-hidden">
              <Cropper
                key={cropperReady ? "ready" : "not-ready"}
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            {uploadProgress !== null && (
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden mt-4 mb-2">
                <div
                  className="bg-gradient-pink-purple h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <div className="flex gap-2 mt-4 justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Batal
              </Button>
              <Button
                isLoading={uploading}
                ref={uploadButtonRef}
                variant="primary"
                type="submit"
              >
                Upload
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <div>
        {value ? (
          <div className="relative w-[200px] h-[200px] rounded-md">
            <Button
              variant="delete"
              size="icon"
              type="button"
              onClick={handleRemove}
              isLoading={isLoadingDelete}
              disabled={isLoadingUpload || isLoadingDelete || disabled}
              isFetching={isFetching}
              className="z-10 absolute -top-3 -right-3"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Hapus foto</span>
            </Button>
            <Image
              src={
                value ||
                "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751019216/default-user_ranqqa.png"
              }
              alt="Foto"
              aspectRatio="aspect-square"
              className="rounded-lg mb-1 w-full mx-auto"
              isFetching={isFetching}
            />
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              id={id}
            />

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
          </>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
