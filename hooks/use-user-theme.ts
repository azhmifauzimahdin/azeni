import { ThemeService } from "@/lib/services";
import useThemeUserStore from "@/stores/theme-user-store";
import { useEffect, useState, useCallback } from "react";

const useUserThemes = (invitationId: string) => {
  const themes = useThemeUserStore((state) => state.themes);
  const setThemes = useThemeUserStore((state) => state.setThemes);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await ThemeService.fetchThemesByInvitationId(invitationId);
      setThemes(res.data);
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setIsFetching(false);
    }
  }, [invitationId, setThemes]);

  useEffect(() => {
    if (themes.length === 0) {
      fetchData();
    }
  }, [themes.length, fetchData]);

  return { themes, isFetching, refetch: fetchData };
};

export default useUserThemes;
