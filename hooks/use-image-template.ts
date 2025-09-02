import { ImageTemplateService } from "@/lib/services";
import useImageTemplateStore from "@/stores/image-template-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useImageTemplates = () => {
  const user = useUserStore((state) => state.user);
  const imageTemplates = useImageTemplateStore((state) => state.imageTemplates);
  const setImageTemplates = useImageTemplateStore(
    (state) => state.setImageTemplates
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ImageTemplateService.fetchImageTemplates();
      setImageTemplates(res.data);
    } catch (error) {
      console.error("Error fetching image templates:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setImageTemplates]);

  useEffect(() => {
    if (user && imageTemplates.length === 0) {
      fetchData();
    }
  }, [user, imageTemplates.length, fetchData]);

  return { imageTemplates, isFetching, refetch: fetchData };
};

export default useImageTemplates;
