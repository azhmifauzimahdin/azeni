"use client";

import { ReferralWithdrawal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import ImagePreviewModal from "@/components/ui/image-preview-modal";
import { useState } from "react";

interface ReferralCodeWithdrawalFormProps {
  initialData: ReferralWithdrawal[] | undefined;
  isFetching?: boolean;
}

const ReferralCodeWithdrawalForm: React.FC<ReferralCodeWithdrawalFormProps> = ({
  initialData,
  isFetching,
}) => {
  const [isModalPreviewImageOpen, setIsModalPreviewImageOpen] =
    useState<boolean>(false);
  const [withdrawal, setWitdhrawal] = useState<ReferralWithdrawal | undefined>(
    undefined
  );
  return (
    <>
      <ImagePreviewModal
        url={withdrawal?.transferProofUrl ?? ""}
        open={isModalPreviewImageOpen}
        onOpenChange={setIsModalPreviewImageOpen}
      />
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onProofClick: (id) => {
                setWitdhrawal(initialData?.find((item) => item.id === id));
                setIsModalPreviewImageOpen(true);
              },
            })}
            data={initialData || []}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralCodeWithdrawalForm;
