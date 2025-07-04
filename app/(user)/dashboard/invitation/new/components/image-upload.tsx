/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import Modal from "@/components/ui/modal";
import { ImageService } from "@/lib/services";
import getCroppedImg from "@/lib/utils/crop-image";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import { ImagePlus, X } from "lucide-react";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

interface ImageUploadProps {
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

  const handleClick = () => {
    if (!isLoadingUpload) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    const file = e.target.files?.[0];
    if (!file) return;

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

      const { signature } = await ImageService.getSignature({
        timestamp: timestamp.toString(),
        folder,
      });

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
      toast.success("Foto berhasil diupload.");
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

  return (
    <>
      <Modal
        title="Upload Foto"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {imageSrc && (
          <>
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
                onClick={uploadCroppedImage}
                isLoading={uploading}
                variant="primary"
                type="button"
              >
                Upload
              </Button>
            </div>
          </>
        )}
      </Modal>

      <div>
        {value ? (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-1 right-1">
              <Button
                onClick={handleRemove}
                isLoading={isLoadingDelete}
                disabled={isLoadingUpload || isLoadingDelete || disabled}
                type="button"
                isFetching={isFetching}
                variant="default"
                size="icon"
                className="text-destructive bg-transparent shadow-none hover:bg-transparent hover:text-green-app-primary"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Hapus foto</span>
              </Button>
            </div>
            <Image
              src={
                value ||
                "https://res.cloudinary.com/dxtqjuvcg/image/upload/v1751019216/default-user_ranqqa.png"
              }
              alt="Foto"
              aspectRatio="aspect-square"
              className="rounded-lg mb-1 w-1/3 md:w-full mx-auto"
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
