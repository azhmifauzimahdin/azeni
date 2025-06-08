import clsx from "clsx";
import ImageNext from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  aspectRatio: string;
  className?: string;
  priority?: boolean;
}
const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  className,
  priority = false,
  ...rest
}) => {
  return (
    <div
      className={clsx("relative overflow-hidden", aspectRatio, className)}
      {...rest}
    >
      <ImageNext
        src={src}
        alt={alt}
        fill
        sizes="100%"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
};

export default Image;
