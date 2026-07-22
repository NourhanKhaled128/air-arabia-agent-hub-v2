export const dynamic = "force-dynamic";

import CategoryBrowser from "@/components/CategoryBrowser";
import { getArticlesByCategoryId } from "@/lib/article-service";
import { getCategoryBySlug, getCategoryFolders } from "@/lib/category-service";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getViewedTimestamps } from "@/lib/article-view-service";
import { notFound } from "next/navigation";

export default async function CategoryPage({
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

  if (!categoryRow) {
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
      basePath="/Knowledge"
      categoryHref={`/category/${categoryRow.slug}`}
      breadcrumbRoot={{ label: "Home", href: "/" }}
      folders={folders}
      articles={articles}
      folderParam={folder}
      viewedAt={viewedAt}
      hasPortalUser={!!portalUser}
    />
  );
}
