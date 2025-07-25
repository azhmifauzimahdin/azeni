import { MusicService } from "@/lib/services";
import useAdminMusicStore from "@/stores/admin-music-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useAdminMusics = () => {
  const user = useUserStore((state) => state.user);
  const musics = useAdminMusicStore((state) => state.musics);
  const setMusics = useAdminMusicStore((state) => state.setMusics);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    try {
      const res = await MusicService.fetchMusics();
      setMusics(res.data);
    } catch (error) {
      console.error("Error fetching musics:", error);
    } finally {
      setIsFetching(false);
    }
  }, [setMusics, user]);

  useEffect(() => {
    if (user && musics.length === 0) {
      fetchData();
    }
  }, [fetchData, musics.length, user]);

  return { musics, isFetching, refetch: fetchData };
};

export default useAdminMusics;
