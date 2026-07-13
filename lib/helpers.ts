const HUB_BADGE_COLORS: { prefix: string; className: string }[] = [
  { prefix: "G9", className: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" },
  { prefix: "3O", className: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
  { prefix: "9P", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { prefix: "E5", className: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  { prefix: "3L", className: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
  { prefix: "Training", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300" },
];

const DEFAULT_BADGE_CLASSES = "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-brand";

/** Distinct badge color per hub (G9/3O/9P/E5/3L) and Training, so agents can scan hub-specific content at a glance. */
export function getCategoryBadgeClasses(categoryName: string): string {
  const match = HUB_BADGE_COLORS.find((h) => categoryName.trim().startsWith(h.prefix));
  return match ? match.className : DEFAULT_BADGE_CLASSES;
}

export function parseModuleNumber(title: string): number | null {
  const match = title.match(/^Module (\d+):/);
  return match ? Number(match[1]) : null;
}

export function sortByModuleNumber<T extends { title: string }>(articles: T[]): T[] {
  return [...articles].sort((a, b) => {
    const aNum = parseModuleNumber(a.title);
    const bNum = parseModuleNumber(b.title);

    if (aNum !== null && bNum !== null) return aNum - bNum;
    if (aNum !== null) return -1;
    if (bNum !== null) return 1;
    return a.title.localeCompare(b.title);
  });
}
