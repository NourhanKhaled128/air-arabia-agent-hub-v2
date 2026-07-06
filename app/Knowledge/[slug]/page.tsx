import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      procedures: {
        orderBy: {
          stepNo: "asc",
        },
      },
      dispositions: true,
      escalations: true,
      notes: true,
      references: true,
    },
  });

  if (!article) {
    notFound();
  }

  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          {article.category}
        </span>

        <h1 className="mt-4 text-5xl font-bold">
          {article.title}
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          {article.description}
        </p>

      </div>

      <section>

        <h2 className="mb-4 text-3xl font-bold">
          Overview
        </h2>

        <p className="whitespace-pre-wrap">
          {article.overview}
        </p>

      </section>

      <section>

        <h2 className="mb-4 text-3xl font-bold">
          Procedure
        </h2>

        <div className="space-y-6">

          {article.procedures.map((step) => (

            <div
              key={step.id}
              className="rounded-2xl border p-6"
            >

              <h3 className="mb-3 text-xl font-semibold">
                Step {step.stepNo}
              </h3>

              <p className="whitespace-pre-wrap">
                {step.content}
              </p>

            </div>

          ))}

        </div>

      </section>

      <section>

        <h2 className="mb-4 text-3xl font-bold">
          Disposition
        </h2>

        <ul className="list-disc space-y-2 pl-6">

          {article.dispositions.map((item) => (

            <li key={item.id}>
              {item.content}
            </li>

          ))}

        </ul>

      </section>

      <section>

        <h2 className="mb-4 text-3xl font-bold">
          Escalation
        </h2>

        <ul className="list-disc space-y-2 pl-6">

          {article.escalations.map((item) => (

            <li key={item.id}>
              {item.content}
            </li>

          ))}

        </ul>

      </section>

      <section>

        <h2 className="mb-4 text-3xl font-bold">
          Notes
        </h2>

        <ul className="list-disc space-y-2 pl-6">

          {article.notes.map((item) => (

            <li key={item.id}>
              {item.content}
            </li>

          ))}

        </ul>

      </section>

    </div>
  );
}