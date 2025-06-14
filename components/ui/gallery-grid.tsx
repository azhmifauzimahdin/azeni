"use client";

import React from "react";
import Image from "./image";
import { Gallery } from "@/types";

type GalleryGridProps = {
  galleries: Gallery[];
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ galleries }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {galleries.slice(0, 6).map((gallery, index) => (
          <Image
            key={index}
            src={gallery.image}
            alt={gallery.description}
            className="rounded"
            aspectRatio="aspect-[9/12]"
            data-aos="fade"
            data-aos-delay={(index + 1) * 200}
          />
        ))}
      </div>
      {galleries.length > 6 ? (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {galleries.slice(6, 8).map((gallery, index) => (
            <Image
              key={index}
              src={gallery.image}
              alt={gallery.description}
              className="rounded"
              aspectRatio="aspect-[9/12]"
              data-aos="fade"
              data-aos-delay={(index + 1) * 200}
            />
          ))}
        </div>
      ) : null}
      {galleries.length > 8 ? (
        <div className="grid grid-cols-1 gap-3">
          {galleries.slice(8).map((gallery, index) => (
            <Image
              key={index}
              src={gallery.image}
              alt={gallery.description}
              className="rounded"
              aspectRatio="aspect-video"
              data-aos="fade"
              data-aos-delay={(index + 1) * 200}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default GalleryGrid;
