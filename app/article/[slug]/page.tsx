import AppLayout from "@/components/AppLayout";
import { articles } from "@/Data/articles";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl">

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
            {article.category}
          </span>

          <span className="text-sm text-gray-500">
            Updated {article.lastUpdated}
          </span>
        </div>

        <h1 className="mt-8 text-5xl font-bold text-black">
          {article.title}
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          {article.description}
        </p>

        <div className="mt-8 rounded-xl bg-gray-100 p-6">
          <p className="font-semibold">
            Author: {article.author}
          </p>
        </div>

        <div className="mt-10 space-y-5">
          {article.content.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-red-700">
                Step {index + 1}
              </h3>

              <p className="mt-3 text-gray-800">
                {step}
              </p>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}