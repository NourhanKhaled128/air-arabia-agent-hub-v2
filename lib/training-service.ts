import { prisma } from "@/lib/prisma";

export async function getTrainingCourses() {
  return prisma.trainingCourse.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTrainingCourse(id: number) {
  return prisma.trainingCourse.findUnique({
    where: {
      id,
    },
    include: {
      lessons: true,
    },
  });
}

export async function createTrainingCourse(data: {
  title: string;
  description?: string;
  duration?: string;
  passingScore?: number;
  status?: string;
}) {
  return prisma.trainingCourse.create({
    data,
  });
}

export async function updateTrainingCourse(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    duration: string;
    passingScore: number;
    status: string;
  }>
) {
  return prisma.trainingCourse.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTrainingCourse(id: number) {
  return prisma.trainingCourse.delete({
    where: {
      id,
    },
  });
}