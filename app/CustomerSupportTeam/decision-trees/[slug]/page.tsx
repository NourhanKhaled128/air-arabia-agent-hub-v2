import DecisionTreeDetailView from "@/components/decision-tree/DecisionTreeDetailView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CustomerSupportTeamDecisionTreePage({ params }: Props) {
  const { slug } = await params;

  return (
    <DecisionTreeDetailView
      slug={slug}
      basePath="/CustomerSupportTeam/decision-trees"
      articleBasePath="/CustomerSupportTeam"
    />
  );
}
