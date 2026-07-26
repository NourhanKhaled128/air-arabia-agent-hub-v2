import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin-dal";
import { exportCategoriesWorkbook } from "@/lib/category-service";

export async function GET() {
  await requireAdminUser();

  const buffer = await exportCategoriesWorkbook();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"categories-export.xlsx\"",
    },
  });
}
