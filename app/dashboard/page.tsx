"use client";

import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div>
      Welcome Admin, <UserButton />
    </div>
  );
}
