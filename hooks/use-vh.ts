"use client";

import { useEffect } from "react";

export default function useVH() {
  useEffect(() => {
    const supportsDVH = CSS.supports("height", "100dvh");

    if (supportsDVH) {
      const testDiv = document.createElement("div");
      testDiv.style.height = "100dvh";
      testDiv.style.position = "fixed";
      testDiv.style.top = "0";
      testDiv.style.left = "0";
      testDiv.style.visibility = "hidden";
      document.body.appendChild(testDiv);

      const vh = testDiv.offsetHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      document.body.removeChild(testDiv);
    } else {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }, []);
}
