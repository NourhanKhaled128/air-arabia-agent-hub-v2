import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin-dal";
import { exportArticlesWorkbook } from "@/lib/article-service";

export async function GET() {
  await requireAdminUser();

  const buffer = await exportArticlesWorkbook();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"articles-export.xlsx\"",
    },
  });
}
