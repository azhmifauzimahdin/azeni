import { QuoteTemplateService } from "@/lib/services";
import useAdminQuoteTemplateStore from "@/stores/admin-quote-template-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminQuoteTemplates = () => {
  const user = useUserStore((state) => state.user);
  const quoteTemplates = useAdminQuoteTemplateStore(
    (state) => state.quoteTemplates
  );
  const setQuoteTemplates = useAdminQuoteTemplateStore(
    (state) => state.setQuoteTemplates
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await QuoteTemplateService.fetchQuoteTemplates();
      setQuoteTemplates(res.data);
    } catch (error) {
      console.error("Error fetching quote templates:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setQuoteTemplates]);

  useEffect(() => {
    if (user && quoteTemplates.length === 0) {
      fetchData();
    }
  }, [user, quoteTemplates.length, fetchData]);

  return { quoteTemplates, isFetching, refetch: fetchData };
};

export default useAdminQuoteTemplates;
