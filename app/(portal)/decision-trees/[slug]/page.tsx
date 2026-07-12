import Link from "next/link";
import { notFound } from "next/navigation";
import { getDecisionTreeBySlug } from "@/lib/decision-tree-service";
import { getExcessBaggageRatesByHub } from "@/lib/excess-baggage-service";
import DecisionTreeWizard from "@/components/DecisionTreeWizard";
import DecisionTreeDiagram from "@/components/DecisionTreeDiagram";

const EXCESS_BAGGAGE_HUB_BY_SLUG: Record<string, string> = {
  "g9-excess-baggage-rates-g9": "G9",
  "3o-excess-baggage-rates-3o": "3O",
  "9p-excess-baggage-rates-9p": "9P",
  "e5-excess-baggage-rates-e5": "E5",
};

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DecisionTreePage({ params }: Props) {
  const { slug } = await params;

  const tree = await getDecisionTreeBySlug(slug);

  if (!tree || tree.status === "Draft") {
    notFound();
  }

  const excessBaggageHub = tree.sourceArticle ? EXCESS_BAGGAGE_HUB_BY_SLUG[tree.sourceArticle.slug] : undefined;
  const excessBaggageRates = excessBaggageHub ? await getExcessBaggageRatesByHub(excessBaggageHub) : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-sm text-gray-500 dark:text-slate-400">
        <Link href="/decision-trees" className="hover:underline">
          Decision Trees
        </Link>
        <span className="mx-2">/</span>
        {tree.title}
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {tree.topic && (
            <span className="rounded-full bg-red-100 dark:bg-brand/10 px-4 py-1.5 text-sm font-semibold text-red-700 dark:text-brand">
              {tree.topic}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-slate-100">{tree.title}</h1>

        {tree.description && (
          <p className="mt-3 text-lg text-gray-600 dark:text-slate-400">{tree.description}</p>
        )}

        {tree.sourceArticle && (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Based on{" "}
            <Link
              href={`/Knowledge/${tree.sourceArticle.slug}`}
              className="font-semibold text-red-700 dark:text-brand hover:underline"
            >
              {tree.sourceArticle.title}
            </Link>
          </p>
        )}
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-slate-100">
          Interactive Walkthrough
        </h2>
        <DecisionTreeWizard
          nodes={tree.nodes}
          excessBaggageHub={excessBaggageHub}
          excessBaggageRates={excessBaggageRates}
        />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-slate-100">
          Full Tree Overview
        </h2>
        <DecisionTreeDiagram nodes={tree.nodes} />
      </section>

      <div>
        <Link href="/decision-trees" className="font-semibold text-red-700 dark:text-brand hover:underline">
          ← Back to Decision Trees
        </Link>
      </div>
    </div>
  );
}
