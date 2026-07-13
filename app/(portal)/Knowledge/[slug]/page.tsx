export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Paperclip, Download, GitBranch, AlertTriangle } from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";
import CopyButton from "@/components/CopyButton";
import PrintButton from "@/components/PrintButton";
import ArticleFeedback from "@/components/ArticleFeedback";
import ArticleTemplateTabs from "@/components/ArticleTemplateTabs";
import ArticleComments from "@/components/ArticleComments";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import { prisma } from "@/lib/prisma";
import { getArticleById, getArticlesByCategoryId } from "@/lib/article-service";
import { getCategoryById } from "@/lib/category-service";
import { getApprovedCommentsForArticle } from "@/lib/comment-service";
import { getDecisionTreesForArticle } from "@/lib/decision-tree-service";
import { getExcessBaggageRatesByHub } from "@/lib/excess-baggage-service";
import ExcessBaggageRateFinder from "@/components/excess-baggage/ExcessBaggageRateFinder";
import { sortByModuleNumber, getCategoryBadgeClasses } from "@/lib/helpers";
import { findConfusablePointer } from "@/lib/confusable-pairs";

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

const statusStyles: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Archived: "bg-slate-200 text-slate-700",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function contactLink(text: string): string | null {
  if (text.includes("@")) return `mailto:${text.trim()}`;

  const digits = text.trim().replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length >= 6) return `tel:${digits}`;

  return null;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const summary = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!summary) {
    notFound();
  }

  const article = await getArticleById(summary.id);

  if (!article) {
    notFound();
  }

  if (article.status === "Draft") {
    notFound();
  }

  const category = article.categoryId
    ? await getCategoryById(article.categoryId)
    : null;
  const categoryName = category?.name ?? "Uncategorized";

  const categoryArticles = article.categoryId
    ? await getArticlesByCategoryId(article.categoryId, undefined, { publishedOnly: true })
    : [];

  const relatedArticles = categoryArticles.filter((related) => related.id !== article.id);

  const approvedComments = await getApprovedCommentsForArticle(article.id);
  const relatedDecisionTrees = await getDecisionTreesForArticle(article.id);
  const confusablePointer = findConfusablePointer(article.slug);

  const excessBaggageHub = EXCESS_BAGGAGE_HUB_BY_SLUG[article.slug];
  const excessBaggageRates = excessBaggageHub
    ? await getExcessBaggageRatesByHub(excessBaggageHub)
    : [];

  let prevModule: { slug: string; title: string } | null = null;
  let nextModule: { slug: string; title: string } | null = null;

  if (article.categoryId) {
    const siblings = sortByModuleNumber(categoryArticles);
    const index = siblings.findIndex((a) => a.id === article.id);

    if (index > 0) prevModule = siblings[index - 1];
    if (index >= 0 && index < siblings.length - 1) nextModule = siblings[index + 1];
  }

  return (
    <>
      <ArticleViewTracker articleId={article.id} />

      <div className="mx-auto max-w-5xl space-y-8">

        <Breadcrumb category={categoryName} title={article.title} />

        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">

          {article.coverImage && (
            <div className="mb-6 h-72 w-full overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex flex-wrap items-center gap-3">

              <span className={`rounded-full px-5 py-2 font-semibold ${getCategoryBadgeClasses(categoryName)}`}>
                {categoryName}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  statusStyles[article.status] ?? "bg-amber-100 text-amber-700"
                }`}
              >
                {article.status}
              </span>

            </div>

            <PrintButton />

          </div>

          <h1 className="mt-4 text-5xl font-bold text-gray-900 dark:text-slate-100">
            {article.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            {article.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 dark:border-border-subtle pt-6 text-sm text-gray-500 dark:text-slate-400">
            <span>By {article.author}</span>
            <span>Last verified {formatDate(article.updatedAt)}</span>
            <span>{article.viewCount} views</span>
            <a href="#feedback" className="font-semibold text-red-700 dark:text-brand hover:underline">
              Spot something outdated? Let us know →
            </a>
          </div>

        </div>

        {relatedDecisionTrees.length > 0 && (
          <Link
            href={`/decision-trees/${relatedDecisionTrees[0].slug}`}
            className="flex items-center gap-3 rounded-2xl border border-red-200 dark:border-brand/30 bg-red-50 dark:bg-brand/10 px-6 py-4 shadow-sm transition hover:border-red-300"
          >
            <GitBranch size={20} className="shrink-0 text-red-700 dark:text-brand" />
            <span className="font-semibold text-red-700 dark:text-brand">
              Walk through this as a decision tree: {relatedDecisionTrees[0].title} →
            </span>
          </Link>
        )}

        {confusablePointer && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-6 py-4 shadow-sm">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" />
            <p className="text-amber-900 dark:text-amber-200">
              <span className="font-bold">Don&apos;t confuse this with: </span>
              {confusablePointer.note}{" "}
              <Link href={`/Knowledge/${confusablePointer.targetSlug}`} className="font-semibold underline">
                See {confusablePointer.targetTitle} →
              </Link>
            </p>
          </div>
        )}

        {(prevModule || nextModule) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-6 py-4 shadow-sm">
            {prevModule ? (
              <Link
                href={`/Knowledge/${prevModule.slug}`}
                className="font-semibold text-red-700 dark:text-brand hover:underline"
              >
                ← {prevModule.title}
              </Link>
            ) : (
              <span />
            )}

            {nextModule && (
              <Link
                href={`/Knowledge/${nextModule.slug}`}
                className="font-semibold text-red-700 dark:text-brand hover:underline"
              >
                {nextModule.title} →
              </Link>
            )}
          </div>
        )}

        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
          <h2 className="mb-4 text-3xl font-bold">Overview</h2>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-slate-300">{article.overview}</p>
        </section>

        {excessBaggageHub && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Rate Finder</h2>
            <ExcessBaggageRateFinder rates={excessBaggageRates} defaultHub={excessBaggageHub} />
          </section>
        )}

        {article.procedures.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Procedure</h2>
            <div className="space-y-6">
              {article.procedures.map((step) => (
                <div
                  key={step.id}
                  className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      Step {step.stepNo}{step.title ? `: ${step.title}` : ""}
                    </h3>
                    <CopyButton text={step.content} compact />
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-slate-300">{step.content}</p>
                  {step.image && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-border-subtle">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.image}
                        alt={`Step ${step.stepNo}${step.title ? `: ${step.title}` : ""}`}
                        className="w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {article.scenarios.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Scenarios</h2>
            <div className="space-y-6">
              {article.scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm"
                >
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    If: {scenario.situation}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-gray-700 dark:text-slate-300">
                    {scenario.response}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(article.chatTemplates.length > 0 || article.emailTemplates.length > 0) && (
          <ArticleTemplateTabs
            chatTemplates={article.chatTemplates}
            emailTemplates={article.emailTemplates}
          />
        )}

        {article.dispositions.length > 0 && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Disposition</h2>
            <div className="space-y-4">
              {article.dispositions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 dark:border-border-subtle p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.category && (
                        <span className="rounded-full bg-gray-100 dark:bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                          {item.category}
                        </span>
                      )}
                      {item.code && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                          {item.code}
                        </span>
                      )}
                    </div>
                    <CopyButton
                      text={[item.category, item.code, item.content, item.scenario].filter(Boolean).join(" — ")}
                      compact
                    />
                  </div>

                  {item.content && (
                    <p className="mt-3 text-gray-700 dark:text-slate-300">{item.content}</p>
                  )}

                  {item.scenario && (
                    <p className="mt-2 text-sm italic text-gray-500 dark:text-slate-400">
                      Scenario: {item.scenario}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {article.escalations.length > 0 && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Escalation</h2>
            <ul className="space-y-3 text-gray-700 dark:text-slate-300">
              {article.escalations.map((item) => {
                const link = contactLink(item.content);

                return (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <span>
                      {item.department && (
                        <span className="font-semibold">{item.department}: </span>
                      )}
                      {link ? (
                        <a href={link} className="text-red-700 hover:underline">
                          {item.content}
                        </a>
                      ) : (
                        item.content
                      )}
                      {item.condition && (
                        <span className="text-gray-500 dark:text-slate-400"> ({item.condition})</span>
                      )}
                    </span>
                    <CopyButton text={item.content} compact />
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {article.notes.length > 0 && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Notes</h2>
            <div className="space-y-3">
              {article.notes.map((item) =>
                item.type === "Warning" ? (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 text-amber-900 dark:text-amber-200"
                  >
                    <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                    <p><span className="font-bold">Warning: </span>{item.content}</p>
                  </div>
                ) : (
                  <p key={item.id} className="pl-1 text-gray-700 dark:text-slate-300">
                    <span className="font-semibold">{item.type}: </span>
                    {item.content}
                  </p>
                )
              )}
            </div>
          </section>
        )}

        {article.images.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Photos</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {article.images.map((img, index) => (
                <div
                  key={img.id}
                  className="h-40 overflow-hidden rounded-2xl border border-gray-200 dark:border-border-subtle shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image}
                    alt={`${article.title} - photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {article.references.length > 0 && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">References</h2>
            <ul className="space-y-3">
              {article.references.map((ref) => (
                <li key={ref.id} className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 dark:bg-background px-3 py-1 text-xs font-semibold text-gray-600 dark:text-slate-400">
                    {ref.type}
                  </span>
                  {ref.link ? (
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-red-700 dark:text-brand hover:underline"
                    >
                      {ref.title}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-700 dark:text-slate-300">{ref.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.attachments.length > 0 && (
          <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Attachments</h2>
            <ul className="space-y-3">
              {article.attachments.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 hover:bg-gray-50 dark:hover:bg-surface-muted"
                  >
                    <Paperclip size={18} className="text-gray-500 dark:text-slate-400" />
                    <span className="flex-1 font-medium text-gray-800 dark:text-slate-200">
                      {file.fileName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {formatFileSize(file.size)}
                    </span>
                    <Download size={18} className="text-gray-400 dark:text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.keywords.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-500 dark:text-slate-400">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="rounded-full bg-gray-100 dark:bg-background px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-slate-400"
                >
                  {keyword.value}
                </span>
              ))}
            </div>
          </section>
        )}

        <ArticleFeedback articleId={article.id} slug={article.slug} />

        <ArticleComments
          articleId={article.id}
          slug={article.slug}
          comments={approvedComments}
        />

        {relatedArticles.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Related Articles</h2>
            <div className="space-y-6">
              {relatedArticles.slice(0, 3).map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}

        <div>
          <Link
            href="/Knowledge"
            className="font-semibold text-red-700 hover:underline"
          >
            ← Back to Knowledge Base
          </Link>
        </div>

      </div>
    </>
  );
}
