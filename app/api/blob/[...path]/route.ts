import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

/**
 * Streams uploaded files back through our own domain instead of the raw
 * vercel-storage.com host. Some networks block that host outright (corporate
 * web filters, some ISPs), which breaks every uploaded image/attachment for
 * anyone behind one — proxying through the app's own origin sidesteps that.
 */
export async function GET(request: Request, { params }: RouteContext) {
  const { path } = await params;
  const pathname = path.join("/");

  const result = await get(pathname, { access: "public" });

  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Length": String(result.blob.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
