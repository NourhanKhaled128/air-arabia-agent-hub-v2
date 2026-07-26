import { NextResponse } from "next/server";
import { getDueScheduledChanges, applyScheduledChange } from "@/lib/scheduled-change-service";

// Invoked daily by the Vercel Cron entry in vercel.json. Not a user-facing route —
// authenticated by a shared secret (Vercel Cron sends this header automatically),
// not an admin session, since there's no browser session on a server-to-server call.
// Read inside the handler, not at module scope — Next.js imports this module during
// `next build` to collect page data, and a top-level throw here fails the whole build.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET environment variable is not set on this deployment." },
      { status: 500 }
    );
  }

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
