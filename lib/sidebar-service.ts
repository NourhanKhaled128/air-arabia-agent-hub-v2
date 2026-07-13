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

/**
 * Whether a champion-facing page should be reachable, based on its registered
 * Sidebar Link's `visible` flag. A page with no matching Sidebar Link (e.g.
 * Knowledge/Training, which aren't nav-toggleable) is always enabled. This is
 * what lets an admin fully disable one of the "Champion Tools" pages I added
 * (Glossary, Quick Reference, Recent Changes, Practice Mode) — hiding the nav
 * link also blocks direct URL access, not just the sidebar entry.
 */
export async function isSidebarLinkEnabled(href: string): Promise<boolean> {
  const link = await prisma.sidebarLink.findFirst({ where: { href } });
  return link ? link.visible : true;
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
