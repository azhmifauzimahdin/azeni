import { MusicService } from "@/lib/services";
import useMusicStore from "@/stores/music-store";
import useUserStore from "@/stores/user-store";
import { useEffect, useState, useCallback } from "react";

const useUserMusics = () => {
  const user = useUserStore((state) => state.user);
  const musics = useMusicStore((state) => state.musics);
  const setMusics = useMusicStore((state) => state.setMusics);
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
  }, [user, setMusics]);

  useEffect(() => {
    if (user && musics.length === 0) {
      fetchData();
    }
  }, [user, musics.length, fetchData]);

  return { musics, isFetching, refetch: fetchData };
};

export default useUserMusics;
