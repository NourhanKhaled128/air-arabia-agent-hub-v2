import { prisma } from "../lib/prisma";

(async () => {
  const quiz = await prisma.quiz.findFirst({ where: { title: "Voice Soft Skills Quiz — QMF 2026" } });
  console.log("id:", quiz?.id, "questionCount check pending");
  const count = await prisma.quizQuestion.count({ where: { quizId: quiz?.id } });
  console.log("questions:", count);
  await prisma.quiz.update({ where: { id: quiz!.id }, data: { status: "Published" } });
  console.log("Published for testing.");
  await prisma.$disconnect();
})();
