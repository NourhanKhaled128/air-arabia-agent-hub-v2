import { prisma } from "@/lib/prisma";

export async function getTeams() {
  return prisma.team.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });
}

export async function getTeamById(id: number) {
  return prisma.team.findUnique({
    where: { id },
    include: { members: { orderBy: { name: "asc" } } },
  });
}

export async function createTeam(data: { name: string }) {
  return prisma.team.create({ data: { name: data.name } });
}

export async function updateTeam(id: number, data: { name: string }) {
  return prisma.team.update({ where: { id }, data });
}

export async function deleteTeam(id: number) {
  return prisma.team.delete({ where: { id } });
}
