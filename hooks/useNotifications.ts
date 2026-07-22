"use client";

import { useEffect, useState } from "react";
import { markNotificationsSeenAction } from "@/app/actions/notifications";

export type NotificationType = "notification" | "announcement" | "disruption";

interface ApiNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  createdAt: string;
}

interface ApiResponse {
  items: ApiNotification[];
  seenAt: {
    notifications: string | null;
    announcements: string | null;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  time: string;
  unread: boolean;
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/** Unread state is account-level (PortalUser.notificationsSeenAt/announcementsSeenAt),
 * not per-browser — so it follows the agent across devices instead of resetting on
 * every new device/browser they log in from. */
function isUnread(item: ApiNotification, seenAt: ApiResponse["seenAt"]) {
  const seen = item.type === "announcement" ? seenAt.announcements : seenAt.notifications;
  if (!seen) return true;
  return new Date(item.createdAt).getTime() > new Date(seen).getTime();
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (cancelled) return;

        setNotifications(
          data.items.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            href: n.href,
            time: formatRelativeTime(n.createdAt),
            unread: isUnread(n, data.seenAt),
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const unread = notifications.filter((n) => n.unread).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    await markNotificationsSeenAction().catch(() => {});
  };

  return {
    notifications,
    unread,
    markAllRead,
  };
}
