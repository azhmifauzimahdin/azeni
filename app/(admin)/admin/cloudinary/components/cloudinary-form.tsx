"use client";

import { CloudinaryUnusedResource } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "@/components/ui/delete-confirmation-modal";
import { CloudinaryService } from "@/lib/services";
import toast from "react-hot-toast";
import { handleError } from "@/lib/utils/handle-error";

interface CloudinaryFormProps {
  initialData: CloudinaryUnusedResource[] | undefined;
  isFetching?: boolean;
}

const CloudinaryForm: React.FC<CloudinaryFormProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<CloudinaryUnusedResource[]>([]);

  useEffect(() => {
    if (initialData) {
      setImages(initialData);
    }
  }, [initialData]);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await CloudinaryService.deleteImages();
      toast.success("Gambar berhasil dihapus.");
      setImages([]);
    } catch (error) {
      handleError(error, "images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        description={"Gambar tidak terpakai"}
        isOpen={isModalDeleteOpen}
        onOpenChange={() => {
          setIsModalDeleteOpen(false);
        }}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns}
            data={images || []}
            isFetching={isFetching}
            onDeleteClick={() => setIsModalDeleteOpen(true)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CloudinaryForm;
