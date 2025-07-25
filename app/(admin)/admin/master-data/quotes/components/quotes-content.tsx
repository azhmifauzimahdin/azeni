"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import QuotesForm from "./quotes-form";
import useAdminQuoteTemplates from "@/hooks/use-admin-quote-template";

const QuotesContent: React.FC = () => {
  const { quoteTemplates, isFetching } = useAdminQuoteTemplates();

  return (
    <>
      <div>
        <Heading title="Quote" />
      </div>
      <div>
        <QuotesForm initialData={quoteTemplates} isFetching={isFetching} />
      </div>
    </>
  );
};

export default QuotesContent;
