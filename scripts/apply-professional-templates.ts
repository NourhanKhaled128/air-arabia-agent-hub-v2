import { prisma } from "../lib/prisma";
import { emailBodyEn, emailBodyAr, type ArticleTemplateSet } from "./kb-templates/types";
import { GENERAL_TEMPLATES } from "./kb-templates/general";
import { G9_3L_TEMPLATES } from "./kb-templates/g9-3l";
import { THREE_O_TEMPLATES } from "./kb-templates/3o";
import { NINE_P_TEMPLATES } from "./kb-templates/9p";
import { E5_TEMPLATES } from "./kb-templates/e5";
import { NEW_CATEGORY_TEMPLATES } from "./kb-templates/new-categories";

const ALL_TEMPLATES: Record<string, ArticleTemplateSet> = {
  ...GENERAL_TEMPLATES,
  ...G9_3L_TEMPLATES,
  ...THREE_O_TEMPLATES,
  ...NINE_P_TEMPLATES,
  ...E5_TEMPLATES,
  ...NEW_CATEGORY_TEMPLATES,
};

async function main() {
  const slugs = Object.keys(ALL_TEMPLATES);
  console.log(`Loaded template sets for ${slugs.length} articles.`);

  let updated = 0;

  for (const slug of slugs) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      console.warn(`No article found for slug: ${slug}`);
      continue;
    }

    const set = ALL_TEMPLATES[slug];
    if (set.length !== 3) {
      console.warn(`Expected 3 scenarios for ${slug}, got ${set.length}`);
    }

    // Wipe existing templates for this article, then load the new bilingual set.
    await prisma.chatTemplate.deleteMany({ where: { articleId: article.id } });
    await prisma.emailTemplate.deleteMany({ where: { articleId: article.id } });

    const chatCreate = set.flatMap((s) => [
      { title: `${s.emailSubjectEn} (English)`, content: s.chatEn },
      { title: `${s.emailSubjectAr} (Arabic)`, content: s.chatAr },
    ]);

    const emailCreate = set.flatMap((s) => [
      {
        title: `${s.emailSubjectEn} (English)`,
        subject: s.emailSubjectEn,
        body: emailBodyEn(s.emailIssueEn, s.emailResolutionEn),
      },
      {
        title: `${s.emailSubjectAr} (Arabic)`,
        subject: s.emailSubjectAr,
        body: emailBodyAr(s.emailIssueAr, s.emailResolutionAr),
      },
    ]);

    await prisma.article.update({
      where: { id: article.id },
      data: {
        chatTemplates: { create: chatCreate },
        emailTemplates: { create: emailCreate },
      },
    });

    updated++;
    console.log(`Replaced templates: ${article.title} (${chatCreate.length} chat, ${emailCreate.length} email)`);
  }

  console.log(`Done. Updated ${updated} of ${slugs.length} articles.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
