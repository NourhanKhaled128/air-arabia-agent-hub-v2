export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import TrainingLibrary from "@/components/TrainingLibrary";
import { getArticlesByCategoryName } from "@/lib/article-service";
import { sortByModuleNumber } from "@/lib/helpers";

export default async function TrainingArticlesPage() {
  const trainingArticles = sortByModuleNumber(
    await getArticlesByCategoryName("Training")
  );

  return (
    <>
      <PageHeader
        title="Training"
        subtitle={
          trainingArticles.length > 0
            ? `${trainingArticles.length} onboarding modules — work through them in order.`
            : "Training manuals, SOPs and onboarding material."
        }
      />

      <TrainingLibrary modules={trainingArticles} />
    </>
  );
}
