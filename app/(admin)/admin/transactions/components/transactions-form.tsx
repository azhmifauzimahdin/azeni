"use client";

import { Transaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface TransactionsFormProps {
  initialData: Transaction[] | undefined;
  isFetching?: boolean;
}

const TransactionsForm: React.FC<TransactionsFormProps> = ({
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

export default TransactionsForm;
