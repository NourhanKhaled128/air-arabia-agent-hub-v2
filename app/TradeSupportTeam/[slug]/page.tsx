export const dynamic = "force-dynamic";

import ArticleDetailView from "@/components/ArticleDetailView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TradeSupportTeamArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <ArticleDetailView
      slug={slug}
      basePath="/TradeSupportTeam"
      decisionTreeBasePath="/TradeSupportTeam/decision-trees"
      backHref="/TradeSupportTeam"
      backLabel="Trade Support Team"
    />
  );
}
