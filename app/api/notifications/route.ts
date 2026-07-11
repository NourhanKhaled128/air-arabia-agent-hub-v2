import { NextResponse } from "next/server";
import { getUnifiedNotifications } from "@/lib/notification-service";

export async function GET() {
  const notifications = await getUnifiedNotifications();
  return NextResponse.json(notifications);
}
