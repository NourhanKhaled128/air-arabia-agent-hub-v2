"use client";

import type { ReactNode } from "react";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

export default function PortalMain({ children }: { children: ReactNode }) {
  const { dock, collapsed, scrollHidden } = useSidebarPrefs();

  const reclaimed = collapsed || scrollHidden;

  const marginClasses = reclaimed
    ? "lg:ml-0 lg:mr-0"
    : dock === "left"
      ? "lg:ml-[var(--sidebar-width)] lg:mr-0"
      : "lg:mr-[var(--sidebar-width)] lg:ml-0";

  return (
    <main
      className={`ml-0 mr-0 transition-[margin] duration-300 ease-in-out ${marginClasses}`}
    >

      <div className="px-4 py-4 sm:px-8 sm:py-6">

        {children}

      </div>

    </main>
  );
}
