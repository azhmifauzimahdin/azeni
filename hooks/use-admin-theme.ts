import { ThemeService } from "@/lib/services";
import useAdminThemeStore from "@/stores/admin-theme-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminThemes = () => {
  const user = useUserStore((state) => state.user);
  const themes = useAdminThemeStore((state) => state.themes);
  const setThemes = useAdminThemeStore((state) => state.setThemes);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await ThemeService.fetchThemes();
      setThemes(res.data);
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, setThemes]);

  const getThemeById = useCallback(
    (id: string) => {
      return themes.find((theme) => theme.id === id);
    },
    [themes]
  );

  useEffect(() => {
    if (user && themes.length === 0) {
      fetchData();
    }
  }, [user, themes.length, fetchData]);

  return { themes, isFetching, refetch: fetchData, getThemeById };
};

export default useAdminThemes;
