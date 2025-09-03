"use client";

import CoverUpload from "@/components/ui/cover-upload";
import ImageSelect from "@/components/ui/image-select";
import useImageTemplates from "@/hooks/use-image-template";
import { InvitationService } from "@/lib/services";
import { handleError } from "@/lib/utils/handle-error";
import useAdminInvitationStore from "@/stores/admin-invitation-store";
import { Invitation } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SettingCoverFormsProps {
  params: {
    id: string;
  };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingCoverForm: React.FC<SettingCoverFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  const noPhoto = initialData?.theme?.category.name
    .toLowerCase()
    .includes("tanpa foto");
  const { imageTemplates } = useImageTemplates();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<string>("");

  const updateImageInInvitation = useAdminInvitationStore(
    (state) => state.updateImageInInvitation
  );

  useEffect(() => {
    setCoverImage(initialData?.image ?? "");
  }, [initialData]);

  const handleUploadImage = async (url: string) => {
    try {
      setIsLoading(true);
      const res = await InvitationService.updateImageByInvitationId(params.id, {
        image: url,
      });
      updateImageInInvitation(params.id, res.data.image);
      toast.success("Cover undangan berhasil diubah.");
    } catch (error: unknown) {
      handleError(error, "link invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card-dashboard space-y-4 h-full">
        <CoverUpload
          isLoadingUpload={isLoading}
          disabled={isLoading}
          onChange={(url) => {
            handleUploadImage(url);
            setCoverImage(url);
          }}
          path="users/invitations"
          value={coverImage}
          defaultValue="/assets/img/default-groom.png"
          isFetching={isFetching}
          hiddenButton={noPhoto}
        />
        {noPhoto && (
          <ImageSelect
            imageTemplates={imageTemplates.filter(
              (item) => item.type === "cover"
            )}
            isFetching={isFetching}
            buttonClassName="sm:w-full mx-auto"
            isLoading={isLoading}
            onSelect={(value) => {
              handleUploadImage(value);
            }}
          />
        )}
      </div>
    </>
  );
};

export default SettingCoverForm;
