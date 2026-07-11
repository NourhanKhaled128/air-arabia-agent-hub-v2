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
    return 0;
  });
}
