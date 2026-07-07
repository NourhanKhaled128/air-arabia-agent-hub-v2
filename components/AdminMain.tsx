"use client";

import type { ReactNode } from "react";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

export default function AdminMain({ children }: { children: ReactNode }) {
  const { dock, collapsed, scrollHidden } = useSidebarPrefs();

  const reclaimed = collapsed || scrollHidden;

  const marginClasses = reclaimed
    ? "lg:ml-0 lg:mr-0"
    : dock === "left"
      ? "lg:ml-[var(--sidebar-width)] lg:mr-0"
      : "lg:mr-[var(--sidebar-width)] lg:ml-0";

  return (
    <div
      className={`ml-0 mr-0 min-h-screen transition-[margin] duration-300 ease-in-out ${marginClasses}`}
    >
      <main className="p-4 sm:p-8">
        <div className="mx-auto w-full max-w-[1700px] space-y-8">

          {children}

        </div>
      </main>
    </div>
  );
}
