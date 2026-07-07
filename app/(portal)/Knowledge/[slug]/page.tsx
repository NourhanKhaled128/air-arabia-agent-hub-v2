import { notFound } from "next/navigation";
import Link from "next/link";
import { Paperclip, Download } from "lucide-react";

import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";
import { prisma } from "@/lib/prisma";
import { getArticleById, getArticlesByCategory } from "@/lib/article-service";

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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const summary = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!summary) {
    notFound();
  }

  await prisma.article.update({
    where: { id: summary.id },
    data: { viewCount: { increment: 1 } },
  });

  const article = await getArticleById(summary.id);

  if (!article) {
    notFound();
  }

  const relatedArticles = (
    await getArticlesByCategory(article.category)
  ).filter((related) => related.id !== article.id);

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-8">

        <Breadcrumb category={article.category} title={article.title} />

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

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

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-red-100 px-5 py-2 font-semibold text-red-700">
              {article.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                statusStyles[article.status] ?? "bg-amber-100 text-amber-700"
              }`}
            >
              {article.status}
            </span>

          </div>

          <h1 className="mt-4 text-5xl font-bold text-gray-900">
            {article.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {article.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-6 text-sm text-gray-500">
            <span>By {article.author}</span>
            <span>Updated {formatDate(article.updatedAt)}</span>
            <span>{article.viewCount} views</span>
          </div>

        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-3xl font-bold">Overview</h2>
          <p className="whitespace-pre-wrap text-gray-700">{article.overview}</p>
        </section>

        {article.procedures.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Procedure</h2>
            <div className="space-y-6">
              {article.procedures.map((step) => (
                <div
                  key={step.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-3 text-xl font-semibold">
                    Step {step.stepNo}{step.title ? `: ${step.title}` : ""}
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-700">{step.content}</p>
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
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">
                    If: {scenario.situation}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-gray-700">
                    {scenario.response}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {article.dispositions.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Disposition</h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              {article.dispositions.map((item) => (
                <li key={item.id}>
                  {item.code && <span className="font-semibold">{item.code}: </span>}
                  {item.content}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.escalations.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Escalation</h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              {article.escalations.map((item) => (
                <li key={item.id}>
                  {item.department && (
                    <span className="font-semibold">{item.department}: </span>
                  )}
                  {item.content}
                  {item.condition && (
                    <span className="text-gray-500"> ({item.condition})</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.notes.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Notes</h2>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              {article.notes.map((item) => (
                <li key={item.id}>
                  <span className="font-semibold">{item.type}: </span>
                  {item.content}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.images.length > 0 && (
          <section>
            <h2 className="mb-4 text-3xl font-bold">Photos</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {article.images.map((img) => (
                <div
                  key={img.id}
                  className="h-40 overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {article.references.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">References</h2>
            <ul className="space-y-3">
              {article.references.map((ref) => (
                <li key={ref.id} className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {ref.type}
                  </span>
                  {ref.link ? (
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-red-700 hover:underline"
                    >
                      {ref.title}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-700">{ref.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.attachments.length > 0 && (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold">Attachments</h2>
            <ul className="space-y-3">
              {article.attachments.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                  >
                    <Paperclip size={18} className="text-gray-500" />
                    <span className="flex-1 font-medium text-gray-800">
                      {file.fileName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    <Download size={18} className="text-gray-400" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.keywords.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-500">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600"
                >
                  {keyword.value}
                </span>
              ))}
            </div>
          </section>
        )}

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
