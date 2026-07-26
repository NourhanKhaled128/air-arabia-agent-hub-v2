import { NextResponse } from "next/server";
import { getDueScheduledChanges, applyScheduledChange } from "@/lib/scheduled-change-service";

// Invoked daily by the Vercel Cron entry in vercel.json. Not a user-facing route —
// authenticated by a shared secret (Vercel Cron sends this header automatically),
// not an admin session, since there's no browser session on a server-to-server call.
const cronSecret = process.env.CRON_SECRET;
if (!cronSecret) {
  throw new Error(
    "CRON_SECRET environment variable is not set. Add it in your hosting platform's environment variables (it is not read from .env in production)."
  );
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await getDueScheduledChanges();

  let applied = 0;
  let failed = 0;
  for (const change of due) {
    const succeeded = await applyScheduledChange(change);
    if (succeeded) applied++;
    else failed++;
  }

  return NextResponse.json({ checked: due.length, applied, failed });
}
