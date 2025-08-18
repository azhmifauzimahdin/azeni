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
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  galleries: Gallery[];
  imageRounded?: string;
};

const GalleryGrid: React.FC<GalleryGridProps> = ({
  galleries,
  imageRounded = "rounded",
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <>
      <div className="space-y-3 mb-3">
        {(() => {
          const rows: JSX.Element[] = [];
          let i = 0;
          let row = 0;
          let anim = 0;

          while (i < galleries.length) {
            const t = row % 7;
            const hasPair = i + 1 < galleries.length;

            if (t === 0 || t === 3) {
              // === Single full (aspect-video) ===
              const gi = i;
              rows.push(
                <div key={`row-${row}`} className="grid grid-cols-1 gap-3">
                  <Img
                    src={galleries[gi].image}
                    alt={galleries[gi].description}
                    onClick={() => {
                      setCurrentIndex(gi);
                      setIsModalOpen(true);
                    }}
                    wrapperClassName={cn(
                      "cursor-pointer shadow-md aspect-video",
                      imageRounded
                    )}
                    sizes="600px"
                    data-aos="fade"
                    data-aos-delay={++anim * 100}
                  />
                </div>
              );
              i += 1;
            } else if (t === 1 || t === 5) {
              // === Pair equal (aspect-[2/3]) ===
              if (!hasPair) {
                const gi = i;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-1 gap-3">
                    <Img
                      src={galleries[gi].image}
                      alt={galleries[gi].description}
                      onClick={() => {
                        setCurrentIndex(gi);
                        setIsModalOpen(true);
                      }}
                      wrapperClassName={cn(
                        "cursor-pointer shadow-md aspect-[2/3]",
                        imageRounded
                      )}
                      sizes="600px"
                      data-aos="fade"
                      data-aos-delay={++anim * 100}
                    />
                  </div>
                );
                i += 1;
              } else {
                const g1 = i,
                  g2 = i + 1;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-2 gap-3">
                    <Img
                      src={galleries[g1].image}
                      alt={galleries[g1].description}
                      onClick={() => {
                        setCurrentIndex(g1);
                        setIsModalOpen(true);
                      }}
                      wrapperClassName={cn(
                        "cursor-pointer shadow-md aspect-[2/3]",
                        imageRounded
                      )}
                      sizes="300px"
                      data-aos="fade"
                      data-aos-delay={++anim * 100}
                    />
                    <Img
                      src={galleries[g2].image}
                      alt={galleries[g2].description}
                      onClick={() => {
                        setCurrentIndex(g2);
                        setIsModalOpen(true);
                      }}
                      wrapperClassName={cn(
                        "cursor-pointer shadow-md aspect-[2/3]",
                        imageRounded
                      )}
                      sizes="300px"
                      data-aos="fade"
                      data-aos-delay={++anim * 100}
                    />
                  </div>
                );
                i += 2;
              }
            } else if (t === 2 || t === 6) {
              // === Pair 1/3 - 2/3 ===
              if (!hasPair) {
                const gi = i;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-1 gap-3">
                    <Img
                      src={galleries[gi].image}
                      alt={galleries[gi].description}
                      onClick={() => {
                        setCurrentIndex(gi);
                        setIsModalOpen(true);
                      }}
                      wrapperClassName={cn(
                        "cursor-pointer shadow-md aspect-[2/3]",
                        imageRounded
                      )}
                      sizes="600px"
                      data-aos="fade"
                      data-aos-delay={++anim * 100}
                    />
                  </div>
                );
                i += 1;
              } else {
                const g1 = i,
                  g2 = i + 1;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-3 gap-3">
                    {/* 1/3 */}
                    <div className="col-span-1">
                      <div className="w-full aspect-[2/3]">
                        <Img
                          src={galleries[g1].image}
                          alt={galleries[g1].description}
                          onClick={() => {
                            setCurrentIndex(g1);
                            setIsModalOpen(true);
                          }}
                          wrapperClassName={cn(
                            "cursor-pointer shadow-md w-full h-full object-cover",
                            imageRounded
                          )}
                          sizes="200px"
                          data-aos="fade"
                          data-aos-delay={++anim * 100}
                        />
                      </div>
                    </div>
                    {/* 2/3 */}
                    <div className="col-span-2">
                      <div className="w-full h-full">
                        <Img
                          src={galleries[g2].image}
                          alt={galleries[g2].description}
                          onClick={() => {
                            setCurrentIndex(g2);
                            setIsModalOpen(true);
                          }}
                          wrapperClassName={cn(
                            "cursor-pointer shadow-md w-full h-full object-cover",
                            imageRounded
                          )}
                          sizes="400px"
                          data-aos="fade"
                          data-aos-delay={++anim * 100}
                        />
                      </div>
                    </div>
                  </div>
                );
                i += 2;
              }
            } else if (t === 4) {
              // === Pair 2/3 - 1/3 ===
              if (!hasPair) {
                const gi = i;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-1 gap-3">
                    <Img
                      src={galleries[gi].image}
                      alt={galleries[gi].description}
                      onClick={() => {
                        setCurrentIndex(gi);
                        setIsModalOpen(true);
                      }}
                      wrapperClassName={cn(
                        "cursor-pointer shadow-md aspect-[2/3]",
                        imageRounded
                      )}
                      sizes="600px"
                      data-aos="fade"
                      data-aos-delay={++anim * 100}
                    />
                  </div>
                );
                i += 1;
              } else {
                const g1 = i,
                  g2 = i + 1;
                rows.push(
                  <div key={`row-${row}`} className="grid grid-cols-3 gap-3">
                    {/* 2/3 */}
                    <div className="col-span-2">
                      <div className="w-full h-full">
                        <Img
                          src={galleries[g1].image}
                          alt={galleries[g1].description}
                          onClick={() => {
                            setCurrentIndex(g1);
                            setIsModalOpen(true);
                          }}
                          wrapperClassName={cn(
                            "cursor-pointer shadow-md w-full h-full object-cover",
                            imageRounded
                          )}
                          sizes="400px"
                          data-aos="fade"
                          data-aos-delay={++anim * 100}
                        />
                      </div>
                    </div>
                    {/* 1/3 */}
                    <div className="col-span-1">
                      <div className="w-full aspect-[2/3]">
                        <Img
                          src={galleries[g2].image}
                          alt={galleries[g2].description}
                          onClick={() => {
                            setCurrentIndex(g2);
                            setIsModalOpen(true);
                          }}
                          wrapperClassName={cn(
                            "cursor-pointer shadow-md w-full h-full object-cover",
                            imageRounded
                          )}
                          sizes="200px"
                          data-aos="fade"
                          data-aos-delay={++anim * 100}
                        />
                      </div>
                    </div>
                  </div>
                );
                i += 2;
              }
            }

            row += 1;
          }

          return rows;
        })()}
      </div>

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
                  className={cn("block object-contain")}
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
