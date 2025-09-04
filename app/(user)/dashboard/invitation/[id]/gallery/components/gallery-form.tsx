"use client";

import { Gallery, Invitation } from "@/types";
import { MultipleImageUpload } from "./image-upload";
import { useEffect, useState } from "react";
import { GalleryService } from "@/lib/services";
import useInvitationStore from "@/stores/invitation-store";
import { getFolderFromInvitationId } from "@/lib/utils/get-folder-from-invitation-id";
import toast from "react-hot-toast";

interface GalleryFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
  isFull?: boolean;
  disabledMainPhoto?: boolean;
}

const GalleryForm: React.FC<GalleryFormsProps> = ({
  params,
  initialData,
  isFetching,
  isFull,
  disabledMainPhoto,
}) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const addGalleryToInvitation = useInvitationStore(
    (state) => state.addGalleryToInvitation
  );
  const deleteGalleryFromInvitation = useInvitationStore(
    (state) => state.deleteGalleryFromInvitation
  );

  const replaceGalleriesInInvitation = useInvitationStore(
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
          onUpdateCover={onUpdateCover}
          isFetching={isFetching}
          path={`users/galleries/${getFolderFromInvitationId(params.id)}`}
          isFull={isFull}
          disabledMainPhoto={disabledMainPhoto}
        />
      </div>
    </>
  );
};

export default GalleryForm;
