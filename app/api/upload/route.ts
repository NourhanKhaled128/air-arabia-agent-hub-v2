import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

    // Serverless functions have a read-only filesystem in production, so uploads
    // are stored in Vercel Blob rather than written to disk.
    const blob = await put(`uploads/${fileName}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
