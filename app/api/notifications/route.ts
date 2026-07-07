import { NextResponse } from "next/server";
import { getSentNotifications } from "@/lib/notification-service";

export async function GET() {
  const notifications = await getSentNotifications();
  return NextResponse.json(notifications);
}
