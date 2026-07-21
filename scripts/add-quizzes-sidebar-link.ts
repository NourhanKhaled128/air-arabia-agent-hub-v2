// Registers the public "Quizzes" nav entry under Champion Tools.
// Run with: npx tsx scripts/add-quizzes-sidebar-link.ts

import { prisma } from "../lib/prisma";

async function main() {
  const existing = await prisma.sidebarLink.findFirst({ where: { href: "/Quizzes" } });
  if (existing) {
    console.log("Sidebar link already exists:", existing.id);
    return;
  }

  const maxOrder = await prisma.sidebarLink.aggregate({
    where: { section: "tools" },
    _max: { order: true },
  });

  const link = await prisma.sidebarLink.create({
    data: {
      label: "Quizzes",
      href: "/Quizzes",
      icon: "ClipboardCheck",
      section: "tools",
      order: (maxOrder._max.order ?? 0) + 1,
      visible: true,
    },
  });

  console.log("Created sidebar link:", link.id, link.href);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
