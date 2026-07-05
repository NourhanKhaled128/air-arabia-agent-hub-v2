"use client";

export default function ArticleForm() {
  return (
    <form className="space-y-8">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">

          Article Information

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">

              Title

            </label>

            <input
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">

              Category

            </label>

            <select className="w-full rounded-xl border p-3">

              <option>
                Reservations
              </option>

              <option>
                Refunds
              </option>

              <option>
                Payments
              </option>

              <option>
                Systems
              </option>

            </select>

          </div>

        </div>

        <div className="mt-6">

          <label className="mb-2 block font-semibold">

            Short Description

          </label>

          <textarea
            rows={4}
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div className="mt-6">

          <label className="mb-2 block font-semibold">

            Cover Image

          </label>

          <input
            type="file"
            accept="image/*"
          />

        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-5 text-2xl font-bold">

          Overview

        </h2>

        <textarea
          rows={10}
          className="w-full rounded-xl border p-4"
          placeholder="Article overview..."
        />

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-5 text-2xl font-bold">

          Procedure

        </h2>

        <textarea
          rows={8}
          className="w-full rounded-xl border p-4"
          placeholder="Procedure..."
        />

      </div>

      <div className="flex gap-4">

        <button
          type="button"
          className="rounded-xl border px-8 py-3 font-semibold"
        >
          Save Draft
        </button>

        <button
          type="submit"
          className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white"
        >
          Publish
        </button>

      </div>

    </form>
  );
}