"use client";

import { Invitation } from "@/types";
import SettingTemplateForm from "./setting-template-form";

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
    <>
      <SettingTemplateForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
    </>
  );
};

export default SettingForm;
