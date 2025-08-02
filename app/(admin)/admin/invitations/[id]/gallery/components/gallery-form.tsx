"use client";

import { Gallery, Invitation } from "@/types";
import { MultipleImageUpload } from "./image-upload";
import { useEffect, useState } from "react";
import { GalleryService } from "@/lib/services";
import { getFolderFromInvitationId } from "@/lib/utils/get-folder-from-invitation-id";
import toast from "react-hot-toast";
import useAdminInvitationStore from "@/stores/admin-invitation-store";

interface GalleryFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const GalleryForm: React.FC<GalleryFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const addGalleryToInvitation = useAdminInvitationStore(
    (state) => state.addGalleryToInvitation
  );
  const deleteGalleryFromInvitation = useAdminInvitationStore(
    (state) => state.deleteGalleryFromInvitation
  );

  useEffect(() => {
    setGalleries(initialData?.galleries ?? []);
  }, [initialData]);

  const onUploadFinish = async (
    invitationId: string,
    url: string
  ): Promise<Gallery> => {
    const res = await GalleryService.createGallery(invitationId, {
      image: url,
    });
    addGalleryToInvitation(invitationId, res.data);
    return res.data;
  };

  const onRemove = async (galleryId: string) => {
    try {
      await GalleryService.deleteGallery(params.id, galleryId);
      deleteGalleryFromInvitation(params.id, galleryId);
      toast.success("Gambar berhasil dihapus.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus gambar. Coba lagi.");
    }
  };

  return (
    <>
      <div className="space-y-4 card-dashboard ">
        <MultipleImageUpload
          values={galleries}
          onUploadFinish={(url) => onUploadFinish(params.id, url)}
          onRemove={onRemove}
          isFetching={isFetching}
          path={`users/galleries/${getFolderFromInvitationId(params.id)}`}
        />
      </div>
    </>
  );
};

export default GalleryForm;
