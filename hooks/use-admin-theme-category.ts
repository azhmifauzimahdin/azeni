import { ThemeCategoryService } from "@/lib/services";
import useAdminThemeCategoryStore from "@/stores/admin-theme-category-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminThemeCategories = () => {
  const user = useUserStore((state) => state.user);
  const themeCategories = useAdminThemeCategoryStore(
    (state) => state.themeCategories
  );
  const setThemeCategories = useAdminThemeCategoryStore(
    (state) => state.setThemeCategories
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ThemeCategoryService.fetchThemeCategories();
      setThemeCategories(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setThemeCategories]);

  useEffect(() => {
    if (user && themeCategories.length === 0) {
      fetchData();
    }
  }, [user, themeCategories.length, fetchData]);

  return { themeCategories, isFetching, refetch: fetchData };
};

export default useAdminThemeCategories;
