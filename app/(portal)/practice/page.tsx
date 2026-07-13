export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import PracticeDeck from "@/components/PracticeDeck";
import { getRandomScenariosForPractice } from "@/lib/article-service";

export default async function PracticePage() {
  const scenarios = await getRandomScenariosForPractice();

  return (
    <>
      <PageHeader
        title="Practice Mode"
        subtitle="Real scenarios pulled from every article in the Knowledge Base — read the situation, think it through, then reveal the correct response. Ungraded, just for practice."
      />

      <PracticeDeck scenarios={scenarios} />
    </>
  );
}
