import { prisma } from "@/lib/prisma";

export async function getSidebarLinks() {
  return prisma.sidebarLink.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }],
  });
}

export async function getVisibleSidebarLinksBySection(section: string) {
  return prisma.sidebarLink.findMany({
    where: {
      section,
      visible: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function getSidebarLinkById(id: number) {
  return prisma.sidebarLink.findUnique({
    where: { id },
  });
}

export async function createSidebarLink(data: {
  label: string;
  href: string;
  icon?: string;
  section?: string;
  order?: number;
  visible?: boolean;
}) {
  return prisma.sidebarLink.create({
    data,
  });
}

export async function updateSidebarLink(
  id: number,
  data: {
    label?: string;
    href?: string;
    icon?: string;
    section?: string;
    order?: number;
    visible?: boolean;
  }
) {
  return prisma.sidebarLink.update({
    where: { id },
    data,
  });
}

export async function deleteSidebarLink(id: number) {
  return prisma.sidebarLink.delete({
    where: { id },
  });
}

export async function reorderSidebarLinks(orderedIds: number[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.sidebarLink.update({ where: { id }, data: { order: index } })
    )
  );
}
