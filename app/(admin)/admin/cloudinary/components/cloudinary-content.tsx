"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import CloudinaryForm from "./cloudinary-form";
import { handleError } from "@/lib/utils/handle-error";
import { CloudinaryService } from "@/lib/services";
import { CloudinaryUnusedResource } from "@/types";

const CloudinaryContent: React.FC = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [images, setImages] = useState<CloudinaryUnusedResource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const res = await CloudinaryService.fetchImages();
        setImages(res.unusedResources);
      } catch (error) {
        handleError(error, "images");
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Heading title="Cloudinary" />
      </div>
      <div>
        <CloudinaryForm initialData={images} isFetching={isFetching} />
      </div>
    </>
  );
};

export default CloudinaryContent;
