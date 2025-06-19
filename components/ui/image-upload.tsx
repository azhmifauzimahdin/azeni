/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "./image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  path: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
  path,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [upload, setUpload] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
    setUpload(false);
  };

  function getPublicIdFromUrl(url: string) {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const partsAfterVersion = afterUpload.split("/");
    partsAfterVersion.shift();
    const publicIdWithExt = partsAfterVersion.join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => {
                  setUpload(true);
                  const publicId = getPublicIdFromUrl(url);
                  if (publicId) onRemove(publicId);
                }}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image aspectRatio="aspect-square" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        options={{
          folder: path,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
          maxFileSize: 2097152,
        }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        signatureEndpoint="/api/cloudinary-signature"
      >
        {upload
          ? ({ open }) => {
              const onClick = () => open();

              return (
                <Button
                  type="button"
                  disabled={disabled}
                  variant="secondary"
                  onClick={onClick}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Foto
                </Button>
              );
            }
          : undefined}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
