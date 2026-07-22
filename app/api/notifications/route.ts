import { NextResponse } from "next/server";
import { getUnifiedNotifications } from "@/lib/notification-service";
import { getCurrentPortalUser } from "@/lib/portal-dal";

export async function GET() {
  const [notifications, user] = await Promise.all([
    getUnifiedNotifications(),
    getCurrentPortalUser(),
  ]);

  return NextResponse.json({
    items: notifications,
    seenAt: {
      notifications: user?.notificationsSeenAt?.toISOString() ?? null,
      announcements: user?.announcementsSeenAt?.toISOString() ?? null,
    },
  });
}
