import { prisma } from "@/lib/prisma";
import { DEFAULT_HOME_WIDGETS } from "@/lib/home-widget-catalog";

async function ensureSeeded() {
  const count = await prisma.homeWidget.count();

  if (count === 0) {
    await prisma.homeWidget.createMany({ data: DEFAULT_HOME_WIDGETS });
  }
}

export async function getHomeWidgets() {
  await ensureSeeded();

  return prisma.homeWidget.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getVisibleHomeWidgets() {
  await ensureSeeded();

  return prisma.homeWidget.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export async function createHomeWidget(data: { type: string; size?: string; order?: number }) {
  return prisma.homeWidget.create({
    data,
  });
}

export async function updateHomeWidget(
  id: number,
  data: { size?: string; order?: number; visible?: boolean }
) {
  return prisma.homeWidget.update({
    where: { id },
    data,
  });
}

export async function deleteHomeWidget(id: number) {
  return prisma.homeWidget.delete({
    where: { id },
  });
}

export async function reorderHomeWidgets(orderedIds: number[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.homeWidget.update({ where: { id }, data: { order: index } })
    )
  );
}
