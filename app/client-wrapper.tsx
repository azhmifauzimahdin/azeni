"use client";

import useVH from "@/hooks/use-vh";
import React from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useVH();
  return <>{children}</>;
}
