import { prisma } from "../lib/prisma";

const GENERAL_INFO_NAME = "General Information";

interface FoldSpec {
  categoryName: string;
  folderName: string;
  articleSlugs: string[];
}

const FOLDS: FoldSpec[] = [
  {
    categoryName: "AirRewards",
    folderName: "AirRewards",
    articleSlugs: ["airrewards-loyalty-program-all-hubs-1783838668534"],
  },
  {
    categoryName: "Payments",
    folderName: "Payments",
    articleSlugs: [
      "payment-channels-charges-all-hubs-1783838668718",
      "using-credit-vouchers-for-a-new-booking-all-hubs-1783838668831",
    ],
  },
  {
    categoryName: "Reservations",
    folderName: "Reservations",
    articleSlugs: [
      "caller-verification-all-hubs-1783838668928",
      "visa-applications-visa-change-bookings-all-hubs-1783838669014",
      "modification-cancellation-checklists-all-hubs-1783838669091",
      "group-booking-requests-inquiries-all-hubs-1783838669189",
    ],
  },
  {
    categoryName: "Ancillaries",
    folderName: "Ancillaries",
    articleSlugs: ["skytime-onboard-entertainment-all-hubs-1783838669295"],
  },
];

async function main() {
  const generalInfo = await prisma.category.findFirst({ where: { name: GENERAL_INFO_NAME } });
  if (!generalInfo) throw new Error(`Category not found: ${GENERAL_INFO_NAME}`);

  const maxOrder = await prisma.categoryFolder.aggregate({
    where: { categoryId: generalInfo.id },
    _max: { order: true },
  });
  let nextOrder = (maxOrder._max.order ?? -1) + 1;

  for (const fold of FOLDS) {
    const folder = await prisma.categoryFolder.create({
      data: {
        categoryId: generalInfo.id,
        name: fold.folderName,
        order: nextOrder++,
        visible: true,
      },
    });
    console.log(`Created folder "${fold.folderName}" (#${folder.id}) under ${GENERAL_INFO_NAME}`);

    const result = await prisma.article.updateMany({
      where: { slug: { in: fold.articleSlugs } },
      data: { categoryId: generalInfo.id, folderId: folder.id },
    });
    console.log(`  Reassigned ${result.count} article(s) to this folder`);

    const oldCategory = await prisma.category.findFirst({ where: { name: fold.categoryName } });
    if (oldCategory) {
      const remaining = await prisma.article.count({ where: { categoryId: oldCategory.id } });
      if (remaining > 0) {
        console.warn(`  Skipping deletion of category "${fold.categoryName}" — ${remaining} article(s) still reference it`);
        continue;
      }
      await prisma.category.delete({ where: { id: oldCategory.id } });
      console.log(`  Deleted now-empty category "${fold.categoryName}" (#${oldCategory.id})`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
