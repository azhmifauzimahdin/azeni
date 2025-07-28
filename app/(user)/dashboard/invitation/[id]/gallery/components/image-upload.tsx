/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ImagePlus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/lib/services/image";
import { ImageService } from "@/lib/services";
import ImageUI from "@/components/ui/image";
import ImageNext from "next/image";
import type { Gallery } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { ImageSchema } from "@/lib/schemas";
import { FILE_TRANFORMATION } from "@/lib/schemas/image";
import { cloudinaryProxyLoader } from "@/lib/cloudinary-loader";
import { Img } from "@/components/ui/Img";

function CloseModalButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute top-3 right-3 z-50 text-black bg-white/80 hover:bg-white backdrop-blur-sm p-1 rounded-full shadow"
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
    { key: string; previewUrl: string; progress: number; isReady: boolean }[]
  >([]);
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const result = ImageSchema.imageSchema.safeParse(file);
        if (!result.success) {
          toast.error(result.error.errors[0].message);
          continue;
        }

        const key = `${file.name}-${Date.now()}`;
        const previewUrl = URL.createObjectURL(file);

        // Tambahkan dummy dulu agar ada loader
        setUploadingFiles((prev) => [
          ...prev,
          { key, previewUrl, progress: 0, isReady: false },
        ]);

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

            const convertedPreviewUrl = URL.createObjectURL(finalFile);

            const img = new Image();
            img.onload = () => {
              setUploadingFiles((prev) =>
                prev.map((item) =>
                  item.key === key
                    ? {
                        ...item,
                        previewUrl: convertedPreviewUrl,
                        isReady: true,
                      }
                    : item
                )
              );
            };
            img.onerror = () => {
              toast.error("Gagal memuat preview gambar HEIC.");
              setUploadingFiles((prev) =>
                prev.filter((item) => item.key !== key)
              );
            };
            img.src = convertedPreviewUrl;
          } catch (err) {
            console.error("Konversi HEIC gagal:", err);
            toast.error("Gagal mengkonversi gambar HEIC.");
            setUploadingFiles((prev) =>
              prev.filter((item) => item.key !== key)
            );
            continue;
          }
        } else {
          const img = new Image();
          img.onload = () => {
            setUploadingFiles((prev) =>
              prev.map((item) =>
                item.key === key ? { ...item, isReady: true } : item
              )
            );
          };
          img.onerror = () => {
            toast.error("Gagal memuat preview gambar.");
            setUploadingFiles((prev) =>
              prev.filter((item) => item.key !== key)
            );
          };
          img.src = previewUrl;
        }

        try {
          const timestamp = Math.floor(Date.now() / 1000);
          const res = await ImageService.getSignature({
            timestamp: timestamp.toString(),
            folder: path,
            transformation: FILE_TRANFORMATION,
          });

          const { signature } = res.data;

          const uploadRes = await uploadImageToCloudinary(
            {
              file: finalFile,
              api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
              timestamp: timestamp.toString(),
              signature,
              folder: path,
              transformation: FILE_TRANFORMATION,
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
            await onUploadFinish(uploadRes.secure_url);
            toast.success("Gambar berhasil disimpan.");
          } catch {
            toast.error("Gambar gagal disimpan ke database.");
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

  const valuesPerPage = 12;
  const totalPages = Math.ceil(values.length / valuesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const currentvalues = values.slice(
    (currentPage - 1) * valuesPerPage,
    currentPage * valuesPerPage
  );

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className="p-6 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          <ImagePlus className="w-6 h-6 mb-2" />
          <p className="text-sm font-medium">
            Klik atau seret untuk mengunggah foto
          </p>
          <p className="text-xs text-gray-400">Format JPG, PNG, dll.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
        {isFetching
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="relative">
                <div className="border rounded-md overflow-hidden cursor-pointer">
                  <div className="aspect-square w-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          : currentvalues.map((item, index) => (
              <div key={item.id} className="relative">
                <div
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsModalOpen(true);
                  }}
                  className="border rounded-md overflow-hidden cursor-pointer"
                >
                  <Img
                    src={item.image}
                    alt={`image-${item.id}`}
                    wrapperClassName="w-full aspect-square"
                    isFetching={isFetching}
                    sizes="250px"
                  />
                </div>
                <Button
                  variant="delete"
                  size="icon"
                  type="button"
                  onClick={() => handleRemove(item.id, item.image)}
                  isLoading={deletingGalleryId === item.id}
                  className="absolute -top-3 -right-3"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Hapus foto</span>
                </Button>
              </div>
            ))}

        {uploadingFiles.map((file) => (
          <div
            key={file.key}
            className="relative border rounded-md overflow-hidden"
          >
            {!file.isReady ? (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-app-primary" />
              </div>
            ) : (
              <ImageUI
                src={file.previewUrl}
                alt="Uploading..."
                aspectRatio="aspect-square"
                className="object-cover w-full aspect-square opacity-70"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="bg-gradient-pink-purple h-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            siblingCount={1}
          />
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-6xl bg-transparent p-0 border-none shadow-none mx-auto px-4 sm:px-6 md:px-8">
          <div className="sr-only">
            <DialogTitle>Galeri Gambar</DialogTitle>
            <DialogDescription>
              Gunakan tombol panah untuk menelusuri galeri atau hapus gambar.
            </DialogDescription>
          </div>
          <div className="relative h-[75vh] md:h-[90vh] flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center px-4 py-6 w-full">
              <div className="relative inline-block">
                <ImageNext
                  key={values[currentIndex]?.image}
                  loader={cloudinaryProxyLoader}
                  src={values[currentIndex]?.image}
                  alt={`image-${values[currentIndex]?.id}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    height: "60vh",
                    width: "auto",
                    maxWidth: "100%",
                    minWidth: "50vw",
                    minHeight: "200px",
                  }}
                  className="block object-contain rounded-md"
                />
              </div>
            </div>

            <button
              onClick={() =>
                setCurrentIndex((prev) => {
                  const newIndex = prev === 0 ? values.length - 1 : prev - 1;
                  const newPage = Math.floor(newIndex / valuesPerPage) + 1;
                  setCurrentPage(newPage);
                  return newIndex;
                })
              }
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white px-3 sm:px-4 py-2 rounded-full shadow backdrop-blur-md"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) => {
                  const newIndex = prev === values.length - 1 ? 0 : prev + 1;
                  const newPage = Math.floor(newIndex / valuesPerPage) + 1;
                  setCurrentPage(newPage);
                  return newIndex;
                })
              }
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white px-3 sm:px-4 py-2 rounded-full shadow backdrop-blur-md"
            >
              <ChevronRight size={14} />
            </button>

            <CloseModalButton onClick={() => setIsModalOpen(false)} />
            <Button
              variant="delete"
              type="button"
              size="sm"
              onClick={() => {
                const current = values[currentIndex];
                if (current) {
                  handleRemove(current.id, current.image);
                  setIsModalOpen(false);
                }
              }}
              isLoading={deletingGalleryId === values[currentIndex]?.id}
              className="absolute bottom-2 right-1/2 translate-x-1/2 z-10 rounded-full"
            >
              Hapus
              <span className="sr-only">Hapus foto</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
