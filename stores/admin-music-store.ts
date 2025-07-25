import { Music } from "@/types";
import { create } from "zustand";

interface MusicState {
  musics: Music[];
  setMusics: (musics: Music[]) => void;
  upsertMusicAtFirst: (newMusic: Music) => void;
  deleteMusicById: (id: string) => void;
}

const useAdminMusicStore = create<MusicState>((set) => ({
  musics: [],
  setMusics: (musics) => set({ musics }),
  upsertMusicAtFirst: (newMusic) =>
    set((state) => {
      const existingIndex = state.musics.findIndex((b) => b.id === newMusic.id);

      if (existingIndex !== -1) {
        const updatedMusics = [...state.musics];
        updatedMusics[existingIndex] = newMusic;
        return { musics: updatedMusics };
      }

      return { musics: [newMusic, ...state.musics] };
    }),
  deleteMusicById: (id) =>
    set((state) => ({
      musics: state.musics.filter((b) => b.id !== id),
    })),
}));

export default useAdminMusicStore;
