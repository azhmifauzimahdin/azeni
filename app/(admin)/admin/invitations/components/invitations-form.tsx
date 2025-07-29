"use client";

import { Invitation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";

interface InvitationsFormProps {
  initialData: Invitation[] | undefined;
  isFetching?: boolean;
}

const InvitationsForm: React.FC<InvitationsFormProps> = ({
  initialData,
  isFetching,
}) => {
  const router = useRouter();
  return (
    <>
      <Card>
        <CardContent className="p-3">
          <DataTable
            columns={columns({
              onEdit: (id) => router.push(`invitations/${id}`),
            })}
            data={initialData || []}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default InvitationsForm;
