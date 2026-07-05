"use client";

export default function ArticleInfo() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">
        Article Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">

        <div>
          <label className="mb-2 block font-semibold">
            Title
          </label>

          <input
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-red-700 focus:outline-none"
            placeholder="Flight Change Procedure"
          />
        </div>

        <div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select className="w-full rounded-xl border border-gray-300 p-3">

            <option>Reservations</option>
            <option>Refunds</option>
            <option>Payments</option>
            <option>Systems</option>
            <option>Training</option>

          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Status
          </label>

          <select className="w-full rounded-xl border border-gray-300 p-3">

            <option>Draft</option>
            <option>Published</option>
            <option>Archived</option>

          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Author
          </label>

          <input
            className="w-full rounded-xl border border-gray-300 p-3"
            defaultValue="Nourhan Khaled"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-gray-300 p-2"
          />
        </div>

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-semibold">
          Short Description
        </label>

        <textarea
          rows={4}
          className="w-full rounded-xl border border-gray-300 p-4"
          placeholder="Short summary..."
        />

      </div>

    </section>
  );
}