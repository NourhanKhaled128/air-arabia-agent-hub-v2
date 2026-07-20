export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryId } from "@/lib/article-service";
import { getCategoryBySlug, getCategoryFolders } from "@/lib/category-service";
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

  const folderId = folder ? Number(folder) : undefined;

  const [categoryArticles, allFolders] = await Promise.all([
    getArticlesByCategoryId(categoryRow.id, folderId, { publishedOnly: true }),
    getCategoryFolders(categoryRow.id),
  ]);

  const folders = allFolders.filter((f) => f.visible);

  const activeFolder = folderId
    ? folders.find((f) => f.id === folderId)
    : undefined;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: categoryRow.name, href: activeFolder ? `/category/${categoryRow.slug}` : undefined },
          ...(activeFolder ? [{ label: activeFolder.name }] : []),
        ]}
      />

      <PageHeader
        title={activeFolder ? `${categoryRow.name} / ${activeFolder.name}` : categoryRow.name}
        subtitle={`${categoryArticles.length} knowledge articles available`}
      />

      {folders.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <a
            href={`/category/${categoryRow.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              !activeFolder
                ? "bg-red-700 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-red-50"
            }`}
          >
            All
          </a>

          {folders.map((f) => (
            <a
              key={f.id}
              href={`/category/${categoryRow.slug}?folder=${f.id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeFolder?.id === f.id
                  ? "bg-red-700 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-red-50"
              }`}
            >
              {f.name}
            </a>
          ))}
        </div>
      )}

      {categoryArticles.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">
            No articles in this category yet.
          </p>
          <p className="mt-2 text-gray-500">
            Check back soon, or browse other categories from the sidebar.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categoryArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      )}
    </>
  );
}
