"use client";

import useUserStore from "@/stores/user-store";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { user, isSignedIn } = useUser();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (isSignedIn && user) {
      setUser({
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user.imageUrl,
      });
    } else {
      setUser(null);
    }
  }, [isSignedIn, user, setUser]);

  return null;
}
