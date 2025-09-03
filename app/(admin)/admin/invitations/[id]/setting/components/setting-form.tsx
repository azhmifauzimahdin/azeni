"use client";

import { Invitation } from "@/types";
import SettingTemplateForm from "./setting-template-form";
import SettingLinkForm from "./setting-link-form";
import SettingDeleteForm from "./setting-delete-form";
import SettingScanForm from "./setting-scan-form";
import SettingEnableForm from "./setting-enable-form";
import SettingIntroductionForm from "./setting-introduction-form";
import SettingCoverForm from "./setting-cover-form";

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
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-44">
          <SettingCoverForm
            params={params}
            initialData={initialData}
            isFetching={isFetching}
          />
        </div>
        <div className="flex-1">
          <SettingEnableForm
            params={params}
            initialData={initialData}
            isFetching={isFetching}
          />
        </div>
      </div>
      <SettingLinkForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
      <SettingIntroductionForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
      <SettingTemplateForm
        params={params}
        initialData={initialData}
        isFetching={isFetching}
      />
      <SettingScanForm
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
