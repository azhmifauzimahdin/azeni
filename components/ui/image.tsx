"use client";

import { cloudinaryProxyLoader } from "@/lib/cloudinary-loader";
import clsx from "clsx";
import ImageNext from "next/image";
import { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  objectFit?: string;
  isFetching?: boolean;
}

function optimizeCloudinaryUrl(url: string) {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  return url;
}

function getSizesFromClass(className?: string): string {
  if (!className) return "100vw";

  const widthMatch = className.match(/(?:^|\s)w-(\d+)(?:\s|$)/);
  if (widthMatch) {
    const px = parseInt(widthMatch[1], 10) * 4;
    return `${px}px`;
  }

  const customWidthMatch = className.match(/w-\[(\d+)px\]/);
  if (customWidthMatch) {
    return `${customWidthMatch[1]}px`;
  }

  const heightMatch = className.match(/(?:^|\s)h-(\d+)(?:\s|$)/);
  if (heightMatch) {
    const px = parseInt(heightMatch[1], 10) * 4;
    return `${px}px`;
  }

  const customHeightMatch = className.match(/h-\[(\d+)px\]/);
  if (customHeightMatch) {
    return `${customHeightMatch[1]}px`;
  }

  return "100vw";
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  className,
  priority = false,
  objectFit = "object-cover",
  isFetching = false,
}) => {
  const optimizedUrl = optimizeCloudinaryUrl(src);
  const [isLoading, setIsLoading] = useState(true);

  const isCloudinary = src.includes("res.cloudinary.com");

  const image = (
    <ImageNext
      {...(isCloudinary && { loader: cloudinaryProxyLoader })}
      src={optimizedUrl}
      alt={alt}
      fill={!!aspectRatio}
      width={aspectRatio ? undefined : 800}
      height={aspectRatio ? undefined : 600}
      sizes={aspectRatio ? getSizesFromClass(className) : undefined}
      priority={priority}
      className={clsx(
        objectFit,
        "transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100"
      )}
      onLoad={() => setIsLoading(false)}
      onError={() => setIsLoading(false)}
    />
  );

  if (aspectRatio) {
    return (
      <div
        className={clsx(
          "overflow-hidden",
          aspectRatio,
          className?.replace(/\bstatic\b/, ""),
          "relative"
        )}
      >
        {isFetching && (
          <div
            className={clsx(
              "overflow-hidden bg-skeleton",
              aspectRatio,
              className
            )}
          />
        )}
        <div
          className={clsx(
            "transition-opacity duration-700",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        >
          {image}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("relative", className)}>
      {isFetching && (
        <div
          className={clsx(
            "overflow-hidden bg-skeleton",
            aspectRatio,
            className
          )}
        />
      )}
      {image}
    </div>
  );
};

export default Image;
