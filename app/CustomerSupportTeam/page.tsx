export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryId } from "@/lib/article-service";
import { getCategoryBySlug, getCategoryFolders } from "@/lib/category-service";

const CATEGORY_SLUG = "customer-support-team";

interface Props {
  searchParams: Promise<{ folder?: string }>;
}

export default async function CustomerSupportTeamPage({ searchParams }: Props) {
  const { folder } = await searchParams;

  const category = await getCategoryBySlug(CATEGORY_SLUG);

  if (!category) {
    notFound();
  }

  const folderId = folder ? Number(folder) : undefined;

  const [articles, allFolders] = await Promise.all([
    getArticlesByCategoryId(category.id, folderId, { publishedOnly: true }),
    getCategoryFolders(category.id),
  ]);

  const folders = allFolders.filter((f) => f.visible);

  const activeFolder = folderId
    ? folders.find((f) => f.id === folderId)
    : undefined;

  return (
    <>
      <PageHeader
        title={activeFolder ? `Customer Support Team / ${activeFolder.name}` : "Customer Support Team"}
        subtitle={`${articles.length} knowledge articles available`}
      />

      {folders.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <a
            href="/CustomerSupportTeam"
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
              href={`/CustomerSupportTeam?folder=${f.id}`}
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

      {articles.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">
            No articles in this section yet.
          </p>
          <p className="mt-2 text-gray-500">
            Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              basePath="/CustomerSupportTeam"
            />
          ))}
        </div>
      )}
    </>
  );
}
