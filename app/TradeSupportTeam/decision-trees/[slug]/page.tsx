import DecisionTreeDetailView from "@/components/decision-tree/DecisionTreeDetailView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TradeSupportTeamDecisionTreePage({ params }: Props) {
  const { slug } = await params;

  return (
    <DecisionTreeDetailView
      slug={slug}
      basePath="/TradeSupportTeam/decision-trees"
      articleBasePath="/TradeSupportTeam"
    />
  );
}
