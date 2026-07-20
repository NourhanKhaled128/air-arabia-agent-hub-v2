import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-300 dark:text-slate-600">/</span>}

          {item.href ? (
            <Link href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-black dark:text-slate-100">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
