"use client";

import NotificationItem from "./NotificationItem";
import useNotifications from "@/hooks/useNotifications";

export default function NotificationDropdown() {

  const {
    notifications,
    unread,
    markAllRead,
  } = useNotifications();

  return (

    <div className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] rounded-2xl border bg-white shadow-2xl sm:w-96">

      <div className="flex items-center justify-between border-b p-5">

        <h2 className="text-xl font-bold">
          Notifications
        </h2>

        <button
          onClick={markAllRead}
          className="text-sm font-semibold text-red-700"
        >
          Mark all read
        </button>

      </div>

      <div className="max-h-96 overflow-y-auto p-4 space-y-3">

        {notifications.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">
            No notifications yet.
          </p>
        )}

        {notifications.map((item) => (

          <NotificationItem
            key={item.id}
            title={item.title}
            message={item.message}
            time={item.time}
            unread={item.unread}
          />

        ))}

      </div>

      <div className="border-t p-4 text-center text-sm text-gray-500">
        {unread} unread notifications
      </div>

    </div>

  );
}