import Link from "next/link";
import {
  FilePenLine,
  ArrowRight,
} from "lucide-react";

const drafts = [
  {
    id: 1,
    title: "Refund SOP 2026",
    updated: "Today",
  },
  {
    id: 2,
    title: "Baggage Policy Update",
    updated: "Yesterday",
  },
  {
    id: 3,
    title: "Airport Services",
    updated: "2 days ago",
  },
];

export default function DraftsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Draft Articles
        </h1>

      </div>

      <div className="space-y-4">

        {drafts.map((draft) => (

          <div
            key={draft.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-amber-100 p-4">

                <FilePenLine className="text-amber-700" />

              </div>

              <div>

                <h2 className="font-semibold">
                  {draft.title}
                </h2>

                <p className="text-sm text-slate-500">
                  Updated {draft.updated}
                </p>

              </div>

            </div>

            <Link
              href="/admin/articles"
              className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-50"
            >
              Open

              <ArrowRight size={16} />

            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}