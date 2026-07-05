import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { articles } from "@/Data/articles";

interface Props {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find(
    (a) => a.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <AppLayout>

<div className="mx-auto max-w-5xl">

  <Breadcrumb
    category={article.category}
    title={article.title}
  />

  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
    {article.category}
  </span>

  <h1 className="mt-5 text-5xl font-bold text-black">
    {article.title}
  </h1>

        <p className="mt-4 text-lg text-gray-600">
          {article.description}
        </p>

        <div className="mt-6 flex gap-8 text-sm text-gray-500">

          <span>
            👤 {article.author}
          </span>

          <span>
            📅 {article.lastUpdated}
          </span>

        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="mb-8 text-3xl font-bold">
            Procedure
          </h2>

          <ol className="space-y-6">

            {article.content.map((step, index) => (

              <li
                key={index}
                className="flex gap-5"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 font-bold text-white">

                  {index + 1}

                </div>

                <p className="pt-2 text-lg text-gray-700">

                  {step}

                </p>

              </li>

            ))}

          </ol>

        </div>

      </div>

    </AppLayout>
  );
}