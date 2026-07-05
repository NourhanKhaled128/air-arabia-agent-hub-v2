"use client";

export default function RelatedArticlesSection() {

  return (

    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Related Articles

      </h2>

      <input
        placeholder="Search articles..."
        className="mb-6 w-full rounded-xl border p-3"
      />

      <div className="rounded-xl border p-6">

        <p className="text-gray-500">

          Related articles selected will appear here.

        </p>

      </div>

    </section>

  );

}