"use client";

import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { cloudinaryProxyLoader } from "@/lib/cloudinary-loader";
import { HTMLAttributes } from "react";

interface ImgProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  isFetching?: boolean;
  sizes?: string;
  priority?: boolean;
}

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  isFetching = false,
  sizes = "100vw",
  priority = false,
  ...rest
}) => {
  if (!src) return null;

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)} {...rest}>
      {isFetching && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <NextImage
        loader={cloudinaryProxyLoader}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    </div>
  );
};
