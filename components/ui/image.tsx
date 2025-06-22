import clsx from "clsx";
import ImageNext from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  aspectRatio: string;
  className?: string;
  priority?: boolean;
  objectFit?: string;
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
  ...rest
}) => {
  const optimizedUrl = optimizeCloudinaryUrl(src);
  return (
    <div
      className={clsx("relative overflow-hidden", aspectRatio, className)}
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
};

export default Image;
