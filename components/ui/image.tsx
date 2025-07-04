import clsx from "clsx";
import ImageNext from "next/image";

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

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  className,
  priority = false,
  objectFit = "object-cover",
  isFetching,
  ...rest
}) => {
  const optimizedUrl = optimizeCloudinaryUrl(src);

  if (isFetching) {
    return (
      <div
        className={clsx("overflow-hidden bg-skeleton", aspectRatio, className)}
      />
    );
  }

  if (aspectRatio) {
    return (
      <div
        className={clsx(
          "relative overflow-hidden bg-transparent",
          aspectRatio,
          className
        )}
        {...rest}
      >
        <ImageNext
          src={optimizedUrl}
          alt={alt}
          fill
          sizes="100%"
          priority={priority}
          className={objectFit}
        />
      </div>
    );
  }

  return (
    <ImageNext
      src={optimizedUrl}
      alt={alt}
      width={800}
      height={600}
      sizes="100vw"
      priority={priority}
      className={clsx("w-full h-auto", objectFit, className)}
      {...rest}
    />
  );
};

export default Image;
