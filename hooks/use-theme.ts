import { ThemeService } from "@/lib/services";
import useThemeStore from "@/stores/theme-store";
import { useEffect, useState, useCallback } from "react";

const useThemes = () => {
  const themes = useThemeStore((state) => state.themes);
  const setThemes = useThemeStore((state) => state.setThemes);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await ThemeService.fetchThemes();
      setThemes(res);
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setIsFetching(false);
    }
  }, [setThemes]);

  useEffect(() => {
    if (themes.length === 0) {
      fetchData();
    }
  }, [themes.length, fetchData]);

  return { themes, isFetching, refetch: fetchData };
};

export default useThemes;
