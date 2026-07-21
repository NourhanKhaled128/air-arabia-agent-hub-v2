export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getQuizForTaking } from "@/lib/quiz-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";
import QuizRunner from "@/components/QuizRunner";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuizTakePage({ params }: Props) {
  if (!(await isSidebarLinkEnabled("/Quizzes"))) notFound();

  const { id } = await params;
  const quizId = Number(id);
  if (!Number.isInteger(quizId)) notFound();

  const quiz = await getQuizForTaking(quizId);
  if (!quiz || quiz.questions.length === 0) notFound();

  return <QuizRunner quiz={quiz} />;
}
