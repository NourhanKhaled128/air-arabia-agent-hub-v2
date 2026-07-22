import Link from "next/link";

export interface SimpleSearchResult {
  key: string;
  title: string;
  excerpt?: string;
  href: string;
}

interface Props {
  results: SimpleSearchResult[];
  onClose: () => void;
}

export default function SimpleSearchDropdown({ results, onClose }: Props) {
  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface shadow-2xl">
      {results.length === 0 ? (
        <p className="p-5 text-center text-sm text-gray-500 dark:text-slate-400">No results found.</p>
      ) : (
        <div className="p-2">
          {results.map((r) => (
            <Link
              key={r.key}
              href={r.href}
              onClick={onClose}
              className="block rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              <p className="font-semibold text-gray-900 dark:text-slate-100">{r.title}</p>
              {r.excerpt && (
                <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-slate-400">{r.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
