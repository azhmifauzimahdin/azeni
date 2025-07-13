"use client";

import { Invitation } from "@/types";
import SettingTemplateForm from "./setting-template-form";
import SettingLinkForm from "./setting-link-form";
import SettingDeleteForm from "./setting-delete-form";

interface SettingFormsProps {
  params: { id: string };
  initialData: Invitation | undefined;
  isFetching?: boolean;
}

const SettingForm: React.FC<SettingFormsProps> = ({
  params,
  initialData,
  isFetching,
}) => {
  return (
    <div className="space-y-4">
      <SettingLinkForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
      <SettingTemplateForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
      <SettingDeleteForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
    </div>
  );
};

export default SettingForm;
