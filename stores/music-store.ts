import { Music } from "@/types";
import { create } from "zustand";

interface MusicState {
  musics: Music[];
  setMusics: (musics: Music[]) => void;
  addInvitationAtFirst: (newMusic: Music) => void;
}

const useMusicStore = create<MusicState>((set) => ({
  musics: [],
  setMusics: (musics) => set({ musics }),
  addInvitationAtFirst: (newMusic) =>
    set((state) => ({
      musics: [newMusic, ...state.musics],
    })),
}));

export default useMusicStore;
