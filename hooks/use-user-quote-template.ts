import { QuoteTemplateService } from "@/lib/services";
import useQuoteTemplateStore from "@/stores/quote-template-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useUserQuoteTemplates = () => {
  const user = useUserStore((state) => state.user);
  const quoteTemplates = useQuoteTemplateStore((state) => state.quoteTemplates);
  const setQuoteTemplates = useQuoteTemplateStore(
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

export default useUserQuoteTemplates;
