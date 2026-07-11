import Link from "next/link";
import { AlertTriangle, Bell, Megaphone, type LucideIcon } from "lucide-react";
import type { NotificationType } from "@/hooks/useNotifications";

interface Props {
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  time: string;
  unread: boolean;
}

const TYPE_META: Record<NotificationType, { icon: LucideIcon; label: string; badge: string }> = {
  notification: {
    icon: Bell,
    label: "Notification",
    badge: "bg-slate-100 dark:bg-background text-slate-600 dark:text-slate-400",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    badge: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
  },
  disruption: {
    icon: AlertTriangle,
    label: "Disruption",
    badge: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  },
};

export default function NotificationItem({
  type,
  title,
  message,
  href,
  time,
  unread,
}: Props) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;

  const content = (
    <div
      className={`rounded-xl border p-4 transition ${
        unread
          ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
          : "border-gray-200 dark:border-border-subtle bg-white dark:bg-surface"
      } ${href ? "hover:bg-red-50 dark:hover:bg-red-950/40" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">

        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
          <Icon size={12} />
          {meta.label}
        </span>

        {unread && (
          <div className="h-3 w-3 shrink-0 rounded-full bg-red-600"></div>
        )}

      </div>

      <h3 className="mt-2 font-bold text-black dark:text-slate-100">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
        {message}
      </p>

      <p className="mt-3 text-xs text-gray-500 dark:text-slate-500">
        {time}
      </p>

    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
