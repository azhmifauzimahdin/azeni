"use client";

import { Gallery, Invitation } from "@/types";
import { useEffect, useState } from "react";
import { GalleryService } from "@/lib/services";
import { getFolderFromInvitationId } from "@/lib/utils/get-folder-from-invitation-id";
import toast from "react-hot-toast";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { MultipleImageUpload } from "./image-upload";

interface GalleryFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
  isFull?: boolean;
}

const GalleryForm: React.FC<GalleryFormsProps> = ({
  params,
  initialData,
  isFetching,
  isFull,
}) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const addGalleryToInvitation = useAdminInvitationStore(
    (state) => state.addGalleryToInvitation
  );
  const deleteGalleryFromInvitation = useAdminInvitationStore(
    (state) => state.deleteGalleryFromInvitation
  );

  const replaceGalleriesInInvitation = useAdminInvitationStore(
    (state) => state.replaceGalleriesInInvitation
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
    } catch {
      toast.error("Gagal menghapus gambar. Coba lagi.");
    }
  };

  const onUpdateCover = async (galleryId: string) => {
    try {
      const res = await GalleryService.updateCoverGallery(params.id, galleryId);
      replaceGalleriesInInvitation(params.id, res.data);
      toast.success("Gambar berhasil dijadikan foto utama.");
    } catch {
      toast.error("Gagal menjadikan foto utama. Coba lagi.");
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
          onUpdateCover={onUpdateCover}
          path={`users/galleries/${getFolderFromInvitationId(params.id)}`}
          isFull={isFull}
        />
      </div>
    </>
  );
};

export default GalleryForm;
