/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";

interface ClerkUser {
  id: string;
  fullName: string | null;
  emailAddress: string | null;
  imageUrl: string | null;
  [key: string]: any;
}

interface UserState {
  user: ClerkUser | null;
  setUser: (user: ClerkUser | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
