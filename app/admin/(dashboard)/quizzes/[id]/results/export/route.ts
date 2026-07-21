import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin-dal";
import { exportAttemptsWorkbook, getQuizForEdit } from "@/lib/quiz-service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  await requireAdminUser();

  const { id } = await params;
  const quizId = Number(id);
  if (!Number.isInteger(quizId)) {
    return NextResponse.json({ error: "Invalid quiz id" }, { status: 400 });
  }

  const quiz = await getQuizForEdit(quizId);
  if (!quiz) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await exportAttemptsWorkbook(quizId);
  const filename = `${quiz.title.replace(/[^a-z0-9]+/gi, "-")}-results.xlsx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
