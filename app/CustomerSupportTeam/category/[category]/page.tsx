export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import CategoryBrowser from "@/components/CategoryBrowser";
import { getArticlesByCategoryId } from "@/lib/article-service";
import { getCategoryBySlug, getCategoryFolders } from "@/lib/category-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getViewedTimestamps } from "@/lib/article-view-service";

export default async function CustomerSupportTeamCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const { category } = await params;
  const { folder } = await searchParams;

  const decodedSlug = decodeURIComponent(category);

  const categoryRow = await getCategoryBySlug(decodedSlug);

  if (!categoryRow || categoryRow.group !== CUSTOMER_SUPPORT_TEAM_GROUP) {
    notFound();
  }

  const [articles, allFolders, portalUser] = await Promise.all([
    getArticlesByCategoryId(categoryRow.id, undefined, { publishedOnly: true }),
    getCategoryFolders(categoryRow.id),
    getCurrentPortalUser(),
  ]);

  const viewedAt = portalUser
    ? await getViewedTimestamps(portalUser.id, articles.map((a) => a.id))
    : new Map<number, Date>();

  const folders = allFolders.filter((f) => f.visible);

  return (
    <CategoryBrowser
      categoryName={categoryRow.name}
      categorySlug={categoryRow.slug}
      basePath="/CustomerSupportTeam"
      categoryHref={`/CustomerSupportTeam/category/${categoryRow.slug}`}
      breadcrumbRoot={{ label: "Customer Support Team", href: "/CustomerSupportTeam" }}
      folders={folders}
      articles={articles}
      folderParam={folder}
      viewedAt={viewedAt}
      hasPortalUser={!!portalUser}
    />
  );
}
