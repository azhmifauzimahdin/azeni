"use client";

import React, { useState } from "react";
import { Gallery } from "@/types";
import { Img } from "./Img";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./button";
import { cloudinaryProxyLoader } from "@/lib/cloudinary-loader";

type GalleryGridProps = {
  galleries: Gallery[];
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ galleries }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 mb-3">
        {galleries.slice(0, 2).map((gallery, index) => (
          <Img
            key={index}
            src={gallery.image}
            alt={gallery.description}
            onClick={() => {
              setCurrentIndex(index);
              setIsModalOpen(true);
            }}
            wrapperClassName="rounded cursor-pointer shadow-md aspect-video"
            sizes="300px"
            data-aos="fade"
            data-aos-delay={(index + 1) * 200}
          />
        ))}
      </div>
      {galleries.length > 2 ? (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {galleries.slice(2, 8).map((gallery, index) => (
            <Img
              key={index}
              src={gallery.image}
              alt={gallery.description}
              onClick={() => {
                setCurrentIndex(index + 2);
                setIsModalOpen(true);
              }}
              wrapperClassName="rounded cursor-pointer shadow-md aspect-[9/12]"
              sizes="300px"
              data-aos="fade"
              data-aos-delay={(index + 1) * 200}
            />
          ))}
        </div>
      ) : null}
      {galleries.length > 8 ? (
        <div className="grid grid-cols-2 gap-3">
          {galleries.slice(8).map((gallery, index) => (
            <Img
              key={index}
              src={gallery.image}
              alt={gallery.description}
              onClick={() => {
                setCurrentIndex(index + 8);
                setIsModalOpen(true);
              }}
              wrapperClassName="rounded cursor-pointer shadow-md aspect-[9/12]"
              sizes="300px"
              data-aos="fade"
              data-aos-delay={(index + 1) * 200}
            />
          ))}
        </div>
      ) : null}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-6xl bg-transparent p-0 border-none shadow-none mx-auto px-4 sm:px-6 md:px-8">
          <div className="sr-only">
            <DialogTitle>Galeri Gambar</DialogTitle>
            <DialogDescription>
              Gunakan tombol panah untuk menelusuri galeri atau hapus gambar.
            </DialogDescription>
          </div>
          <div className="relative h-[75vh] flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center px-4 py-6 w-full">
              <div className="relative inline-block">
                <Image
                  key={galleries[currentIndex]?.image}
                  {...(galleries[currentIndex]?.image.includes(
                    "res.cloudinary.com"
                  ) && { loader: cloudinaryProxyLoader })}
                  src={galleries[currentIndex]?.image}
                  alt={`image-${galleries[currentIndex]?.id}`}
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
                  const newIndex = prev === 0 ? galleries.length - 1 : prev - 1;
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
                  const newIndex = prev === galleries.length - 1 ? 0 : prev + 1;
                  return newIndex;
                })
              }
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white px-3 sm:px-4 py-2 rounded-full shadow backdrop-blur-md"
            >
              <ChevronRight size={14} />
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 z-50 text-black bg-white/80 hover:bg-white backdrop-blur-sm p-1 rounded-full shadow"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
