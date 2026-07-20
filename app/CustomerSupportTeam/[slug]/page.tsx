export const dynamic = "force-dynamic";

import ArticleDetailView from "@/components/ArticleDetailView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CustomerSupportTeamArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <ArticleDetailView
      slug={slug}
      basePath="/CustomerSupportTeam"
      decisionTreeBasePath="/CustomerSupportTeam/decision-trees"
      backHref="/CustomerSupportTeam"
      backLabel="Customer Support Team"
      categoryBasePath="/CustomerSupportTeam/category"
    />
  );
}
