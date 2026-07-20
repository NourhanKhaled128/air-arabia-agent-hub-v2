"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  draftNotificationCount?: number;
  user?: {
    name: string;
    role: string;
  } | null;
}

export default function AdminHeader({ draftNotificationCount = 0, user }: Props) {
  const { toggleMobileOpen } = useSidebarPrefs();

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-surface px-4 py-4 shadow-sm sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-3">

        <button
          onClick={toggleMobileOpen}
          className="rounded-xl border border-slate-200 dark:border-border-subtle p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-muted lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Air Arabia CMS
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Knowledge Management System
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3 sm:gap-6">

        <button
          onClick={() => window.dispatchEvent(new Event("admin:open-command-palette"))}
          title="Jump to a page or article (Ctrl+K)"
          className="flex w-full items-center gap-2 rounded-xl border border-slate-200 dark:border-border-subtle px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-muted sm:w-64 lg:w-80"
        >
          <span className="flex-1 text-left text-sm">Jump to a page or article...</span>
          <kbd className="rounded-md border border-slate-200 dark:border-border-subtle px-1.5 py-0.5 text-xs">
            Ctrl K
          </kbd>
        </button>

        <ThemeToggle />

        <Link
          href="/admin/notifications"
          title={draftNotificationCount > 0 ? `${draftNotificationCount} draft notification(s)` : "Notifications"}
          className="relative rounded-full bg-slate-100 dark:bg-background p-3 transition hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <Bell size={20} />
          {draftNotificationCount > 0 && (
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-600"></span>
          )}
        </Link>

        <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-background px-4 py-2">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.name ?? "Not signed in"}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user?.role ?? ""}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}
