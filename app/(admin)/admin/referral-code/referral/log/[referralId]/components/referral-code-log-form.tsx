"use client";

import { ReferralCodeLog } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ReferralCodeLogFormProps {
  initialData: ReferralCodeLog[] | undefined;
  isFetching?: boolean;
}

const ReferralCodeLogForm: React.FC<ReferralCodeLogFormProps> = ({
  initialData,
  isFetching,
}) => {
  return (
    <>
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns}
            data={initialData || []}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ReferralCodeLogForm;
