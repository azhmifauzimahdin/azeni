/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/lib/services/image";
import { ImageService } from "@/lib/services";
import Image from "@/components/ui/image";
import type { Gallery } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

function RemoveImageButton({
  onClick,
  loading,
  className = "",
}: {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      onClick={onClick}
      className={`z-50 text-white hover:text-red-500 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-sm p-1 rounded-full shadow ${className}`}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <X className="w-4 h-4" />
      )}
    </Button>
  );
}

function CloseModalButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute top-4 right-4 z-50 text-black bg-white/80 hover:bg-white backdrop-blur-sm p-1 rounded-full shadow"
    >
      <X className="w-4 h-4" />
    </Button>
  );
}

interface MultipleImageUploadProps {
  values: Gallery[];
  onUploadFinish: (url: string) => Promise<Gallery>;
  onRemove: (galleryId: string, imageUrl: string) => void;
  isFetching?: boolean;
  path?: string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  values,
  onUploadFinish,
  onRemove,
  isFetching,
  path = "default",
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<
    { key: string; previewUrl: string; progress: number }[]
  >([]);
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const key = `${file.name}-${Date.now()}`;
        const previewUrl = URL.createObjectURL(file);
        setUploadingFiles((prev) => [
          ...prev,
          { key, previewUrl, progress: 0 },
        ]);

        try {
          const timestamp = Math.floor(Date.now() / 1000);
          const { signature } = await ImageService.getSignature({
            timestamp: timestamp.toString(),
            folder: path,
          });

          const res = await uploadImageToCloudinary(
            {
              file,
              api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
              timestamp: timestamp.toString(),
              signature,
              folder: path,
            },
            (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadingFiles((prev) =>
                  prev.map((item) =>
                    item.key === key ? { ...item, progress: percent } : item
                  )
                );
              }
            }
          );

          try {
            await onUploadFinish(res.secure_url);
            toast.success("Gambar berhasil disimpan.");
          } catch {
            toast.error("Gambar gagal disimpan.");
            continue;
          }
        } catch (err) {
          console.error(err);
          toast.error("Gagal mengupload gambar.");
        } finally {
          setUploadingFiles((prev) => prev.filter((item) => item.key !== key));
        }
      }
    },
    [onUploadFinish, path]
  );

  const handleRemove = async (galleryId: string, imageUrl: string) => {
    setDeletingGalleryId(galleryId);
    try {
      await onRemove(galleryId, imageUrl);
    } finally {
      setDeletingGalleryId(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="mt-4 p-6 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          <ImagePlus className="w-6 h-6 mb-2" />
          <p className="text-sm font-medium">
            Klik atau seret untuk mengunggah foto
          </p>
          <p className="text-xs text-gray-400">
            Maksimal 2MB. Format JPG, PNG, dll.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
        {isFetching
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="relative">
                <div className="border rounded-md overflow-hidden cursor-pointer">
                  <div className="aspect-square w-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15l-5.5-5.5L5 21"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          : values.map((item, index) => (
              <div key={item.id} className="relative">
                <div
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsModalOpen(true);
                  }}
                  className="border rounded-md overflow-hidden cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={`image-${item.id}`}
                    aspectRatio="aspect-square"
                    className="object-cover w-full"
                    isFetching={isFetching}
                  />
                </div>
                <RemoveImageButton
                  onClick={() => handleRemove(item.id, item.image)}
                  loading={deletingGalleryId === item.id}
                  className="absolute -top-3 -right-3"
                />
              </div>
            ))}

        {uploadingFiles.map((file) => (
          <div
            key={file.key}
            className="relative border rounded-md overflow-hidden"
          >
            <img
              src={file.previewUrl}
              alt="Uploading..."
              className="object-cover w-full aspect-square opacity-70"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-6xl bg-transparent p-0 border-none shadow-none mx-auto px-4 sm:px-6 md:px-8">
          <div className="sr-only">
            <DialogTitle>Galeri Gambar</DialogTitle>
            <DialogDescription>
              Gunakan tombol panah untuk menelusuri galeri atau hapus gambar.
            </DialogDescription>
          </div>
          <div className="relative h-[75vh] md:h-[90vh] flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
            <div className="relative max-h-full max-w-full px-12 sm:px-16 py-10">
              <img
                src={values[currentIndex]?.image}
                alt={`image-${values[currentIndex]?.id}`}
                className="max-h-[55vh] md:max-h-[75vh] max-w-full object-contain rounded-md shadow-xl"
              />

              <RemoveImageButton
                onClick={() => {
                  const current = values[currentIndex];
                  if (current) {
                    handleRemove(current.id, current.image);
                    setIsModalOpen(false);
                  }
                }}
                loading={deletingGalleryId === values[currentIndex]?.id}
                className="absolute top-7 right-8 md:right-12"
              />
            </div>

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? values.length - 1 : prev - 1
                )
              }
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white px-3 sm:px-4 py-2 rounded-full shadow backdrop-blur-md"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === values.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white px-3 sm:px-4 py-2 rounded-full shadow backdrop-blur-md"
            >
              ›
            </button>

            <CloseModalButton onClick={() => setIsModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
