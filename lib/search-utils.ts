export interface SearchField {
  source: string;
  text: string;
}

export interface MatchSnippet {
  source: string;
  snippet: string;
  matchStart: number;
  matchLen: number;
}

export function findMatchSnippet(
  fields: SearchField[],
  query: string,
  radius = 70
): MatchSnippet | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  for (const field of fields) {
    if (!field.text) continue;

    const index = field.text.toLowerCase().indexOf(q);
    if (index === -1) continue;

    const start = Math.max(0, index - radius);
    const end = Math.min(field.text.length, index + q.length + radius);

    const snippet =
      (start > 0 ? "…" : "") +
      field.text.slice(start, end).trim() +
      (end < field.text.length ? "…" : "");

    return {
      source: field.source,
      snippet,
      matchStart: index - start + (start > 0 ? 1 : 0),
      matchLen: q.length,
    };
  }

  return null;
}
