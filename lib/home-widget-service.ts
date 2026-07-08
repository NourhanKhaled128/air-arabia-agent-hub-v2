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

export async function moveHomeWidget(id: number, direction: "up" | "down") {
  const widgets = await prisma.homeWidget.findMany({ orderBy: { order: "asc" } });
  const index = widgets.findIndex((w) => w.id === id);

  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (swapIndex < 0 || swapIndex >= widgets.length) return;

  const current = widgets[index];
  const swapWith = widgets[swapIndex];

  await prisma.$transaction([
    prisma.homeWidget.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.homeWidget.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
}
