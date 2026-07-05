"use client";

import { useState } from "react";
import { notifications as initial } from "@/Data/notifications";

export default function useNotifications() {
  const [notifications, setNotifications] = useState(initial);

  const unread = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(
      notifications.map(n => ({
        ...n,
        unread: false,
      }))
    );
  };

  return {
    notifications,
    unread,
    markAllRead,
  };
}