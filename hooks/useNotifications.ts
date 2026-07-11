"use client";

import { useEffect, useState } from "react";

const READ_IDS_KEY = "notifications:read-ids";

export type NotificationType = "notification" | "announcement" | "disruption";

interface ApiNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  createdAt: string;
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

function loadReadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(READ_IDS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data: ApiNotification[]) => {
        if (cancelled) return;

        const readIds = new Set(loadReadIds());

        setNotifications(
          data.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            href: n.href,
            time: formatRelativeTime(n.createdAt),
            unread: !readIds.has(n.id),
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

  const markAllRead = () => {
    localStorage.setItem(
      READ_IDS_KEY,
      JSON.stringify(notifications.map((n) => n.id))
    );

    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return {
    notifications,
    unread,
    markAllRead,
  };
}
