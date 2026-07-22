import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  getUncategorizedArticles,
  getEmptyCategories,
  getDanglingDecisionLinks,
  getStaleArticles,
} from "@/lib/content-health-service";
import { getTopSearchMisses } from "@/lib/search-miss-service";

export default async function ContentHealthPage() {
  const [uncategorized, emptyCategories, danglingLinks, stale, topMisses] = await Promise.all([
    getUncategorizedArticles(),
    getEmptyCategories(),
    getDanglingDecisionLinks(),
    getStaleArticles(),
    getTopSearchMisses(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Content Health"
        description="A checklist of content issues worth fixing — not a dashboard, just a punch list."
      />

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Uncategorized Articles ({uncategorized.length})</h2>
        {uncategorized.length === 0 ? (
          <p className="text-slate-500">None — every article has a category.</p>
        ) : (
          <ul className="space-y-2">
            {uncategorized.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{a.title}</span>
                  <span className="text-sm text-slate-500">{a.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Empty Categories ({emptyCategories.length})</h2>
        {emptyCategories.length === 0 ? (
          <p className="text-slate-500">None — every category has at least one article.</p>
        ) : (
          <ul className="space-y-2">
            {emptyCategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/categories/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Dangling Decision-Tree Links ({danglingLinks.length})</h2>
        {danglingLinks.length === 0 ? (
          <p className="text-slate-500">None — every option points at a real node.</p>
        ) : (
          <ul className="space-y-2">
            {danglingLinks.map((o) => (
              <li key={o.id} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="font-medium text-red-800">&ldquo;{o.label}&rdquo;</p>
                <p className="text-sm text-red-600">
                  in {o.node.tree.title} — points at missing node #{o.targetNodeId}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Stale Articles — not updated in 6+ months ({stale.length})</h2>
        {stale.length === 0 ? (
          <p className="text-slate-500">None — every published article was updated recently.</p>
        ) : (
          <ul className="space-y-2">
            {stale.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{a.title}</span>
                  <span className="text-sm text-slate-500">{a.updatedAt.toLocaleDateString("en-GB")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Top Failed Searches ({topMisses.length})</h2>
        {topMisses.length === 0 ? (
          <p className="text-slate-500">No zero-result searches recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {topMisses.map((m) => (
              <li key={m.query} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-800">&ldquo;{m.query}&rdquo;</span>
                <span className="text-sm text-slate-500">{m.count} time{m.count === 1 ? "" : "s"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
