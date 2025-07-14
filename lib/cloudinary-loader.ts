export const cloudinaryProxyLoader = ({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `/api/public/image-proxy?url=${encodeURIComponent(src)}`;
};
