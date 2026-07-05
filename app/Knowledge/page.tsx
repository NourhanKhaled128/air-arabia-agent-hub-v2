import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function KnowledgePage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Knowledge Base
      </h1>

      <div className="grid gap-6">

        {articles.map((article) => (

          <Link
            key={article.id}
            href={`/Knowledge/${article.slug}`}
            className="rounded-3xl bg-white p-6 shadow transition hover:shadow-lg"
          >

            <p className="text-sm text-red-700">

              {article.category}

            </p>

            <h2 className="mt-2 text-2xl font-bold">

              {article.title}

            </h2>

            <p className="mt-3 text-gray-600">

              {article.description}

            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}