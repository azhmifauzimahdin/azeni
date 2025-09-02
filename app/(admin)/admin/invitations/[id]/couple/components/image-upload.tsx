/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { ImageSchema } from "@/lib/schemas";
import { ImageService } from "@/lib/services";
import getCroppedImg from "@/lib/utils/crop-image";
import extractCloudinaryPublicId from "@/lib/utils/extract-cloudinary-public-id";
import clsx from "clsx";
import { ImagePlus, Trash2 } from "lucide-react";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { FILE_TRANFORMATION } from "@/lib/schemas/image";
import { Img } from "@/components/ui/Img";

interface ImageUploadProps {
  isLoadingUpload?: boolean;
  isLoadingDelete?: boolean;
  disabled?: boolean;
  isFetching?: boolean;
  onChange: (value: string) => void;
  onRemove: (publicId: string) => void;
  value: string;
  defaultValue: string;
  path: string;
  hiddenButton?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  isLoadingUpload,
  isLoadingDelete,
  disabled,
  isFetching,
  onChange,
  onRemove,
  value,
  defaultValue,
  path,
  hiddenButton = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>("image/jpeg");
  const [isConverting, setIsConverting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!isLoadingUpload) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOpen(true);
    setIsConverting(true);

    try {
      const result = ImageSchema.imageSchema.safeParse(file);

      if (!result.success) {
        toast.error(result.error.errors[0].message);
        setIsOpen(false);
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
          const heic2any = (await import("heic2any")).default;
          const output = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.95,
          });

          const blob = Array.isArray(output) ? output[0] : output;

          finalFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
            type: "image/jpeg",
          });

          setFileMimeType("image/jpeg");
        } catch (err) {
          console.error("Konversi HEIC gagal:", err);
          toast.error("Gagal mengkonversi gambar HEIC.");
          setIsOpen(false);
          return;
        }
      } else {
        setFileMimeType(file.type || "image/jpeg");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
          setUploadProgress(null);
        } else {
          toast.error("Gagal menampilkan preview gambar.");
          setIsOpen(false);
        }
      };
      reader.readAsDataURL(finalFile);
    } finally {
      setIsConverting(false);
      e.target.value = "";
    }
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
      const transformation = FILE_TRANFORMATION;

      const res = await ImageService.getSignature({
        timestamp: timestamp.toString(),
        folder,
        transformation,
      });

      const { signature } = res.data;

      const uploadRes = await ImageService.uploadImageToCloudinary(
        {
          file: blob,
          api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          timestamp: timestamp.toString(),
          signature,
          folder,
          transformation,
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
      setImageSrc(null);
      setCroppedAreaPixels(null);
      setUploadProgress(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        onClose={() => {
          setIsOpen(false);
          setImageSrc(null);
          setCroppedAreaPixels(null);
          setUploadProgress(null);
          setIsConverting(false);
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        initialFocusRef={uploadButtonRef}
      >
        {isConverting ? (
          <div className="flex flex-col items-center justify-center aspect-square space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-app-primary" />
            <p className="text-sm text-muted-foreground">
              Sedang menyiapkan gambar...
            </p>
          </div>
        ) : (
          imageSrc && (
            <form onSubmit={handleSubmit}>
              <div className="relative w-full aspect-square md:aspect-[6/5] bg-gray-200 rounded-sm overflow-hidden">
                <Cropper
                  key={cropperReady ? "ready" : "not-ready"}
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />

                {uploading && (
                  <div className="absolute inset-0 bg-white/60 z-50 cursor-not-allowed flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-app-primary" />
                  </div>
                )}
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
                  disabled={uploading}
                >
                  Batal
                </Button>
                <Button
                  ref={uploadButtonRef}
                  isLoading={uploading}
                  variant="primary"
                  type="submit"
                >
                  Upload
                </Button>
              </div>
            </form>
          )
        )}
      </Modal>

      <div>
        {value ? (
          <Img
            src={value || defaultValue}
            alt="Foto"
            wrapperClassName="w-1/3 md:w-full aspect-[3/4] rounded overflow-hidden mb-3 mx-auto"
            sizes="300px"
          />
        ) : (
          <div className="w-1/3 md:w-full aspect-[3/4] rounded overflow-hidden mb-3 mx-auto flex-center border border-slate-300 text-slate-500 text-sm">
            Tanpa Foto
          </div>
        )}

        {!hiddenButton && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div
              className={clsx(
                "grid justify-items-center gap-3",
                value ? "grid-cols-2 md:grid-cols-1" : "grid-cols-1"
              )}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={handleClick}
                isLoading={isLoadingUpload}
                disabled={isLoadingUpload || isLoadingDelete || disabled}
                className={clsx(
                  "w-auto md:w-full",
                  value && "justify-self-end"
                )}
                isFetching={isFetching}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload
              </Button>

              {value && (
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  isLoading={isLoadingDelete}
                  disabled={isLoadingUpload || isLoadingDelete || disabled}
                  type="button"
                  className="w-auto md:w-full justify-self-start"
                  isFetching={isFetching}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
