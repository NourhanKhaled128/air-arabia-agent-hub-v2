"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import useNotifications from "@/hooks/useNotifications";

export default function NotificationBell() {

  const [open, setOpen] = useState(false);

  const { notifications, unread, markAllRead } = useNotifications();

  function toggleOpen() {
    const next = !open;
    setOpen(next);

    // Mark as read as soon as the agent actually opens and views the list —
    // no separate "did they click the button" step required.
    if (next) markAllRead();
  }

  return (

    <div className="relative">

      <button
        onClick={toggleOpen}
        className="relative rounded-xl border border-gray-200 dark:border-border-subtle p-3 text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
      >

        <Bell className="h-6 w-6" />

        {unread > 0 && (

          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">

            {unread}

          </span>

        )}

      </button>

      {open && <NotificationDropdown notifications={notifications} unread={unread} />}

    </div>

  );
}