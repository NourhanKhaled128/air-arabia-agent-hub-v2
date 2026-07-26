import { prisma } from "@/lib/prisma";

const URL_REGEX = /https?:\/\/[^\s")]+/g;

export interface LinkCheckResult {
  source: string;
  label: string;
  url: string;
  status: "ok" | "broken" | "slow";
}

function extractUrls(text: string | null | undefined): string[] {
  if (!text) return [];
  return Array.from(new Set(text.match(URL_REGEX) ?? []));
}

async function checkUrl(url: string, timeoutMs = 5000): Promise<"ok" | "broken" | "slow"> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    // Some servers don't support HEAD — retry with GET before calling it broken.
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    }

    if (!response.ok) return "broken";
    return Date.now() - start > 3000 ? "slow" : "ok";
  } catch {
    return "broken";
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runNext(): Promise<void> {
    const index = cursor++;
    if (index >= items.length) return;
    results[index] = await worker(items[index]);
    return runNext();
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => runNext())
  );

  return results;
}

/** Scans article content and Important Links for http(s) URLs and checks each is
 * reachable. On-demand only — triggered by an admin click, never on a schedule, so
 * there's no unattended outbound traffic. */
export async function checkAllLinks(): Promise<LinkCheckResult[]> {
  const [articles, importantLinks] = await Promise.all([
    prisma.article.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        overview: true,
        notes: { select: { content: true } },
        scenarios: { select: { situation: true, response: true } },
        procedures: { select: { content: true } },
        escalations: { select: { content: true } },
        references: { select: { link: true } },
      },
    }),
    prisma.importantLink.findMany({
      where: { visible: true },
      select: { title: true, url: true },
    }),
  ]);

  const candidates: { source: string; label: string; url: string }[] = [];

  for (const article of articles) {
    const text = [
      article.description,
      article.overview,
      ...article.notes.map((n) => n.content),
      ...article.scenarios.flatMap((s) => [s.situation, s.response]),
      ...article.procedures.map((p) => p.content),
      ...article.escalations.map((e) => e.content),
    ].join("\n");

    for (const url of extractUrls(text)) {
      candidates.push({ source: `Article: ${article.title}`, label: article.title, url });
    }

    for (const reference of article.references) {
      if (reference.link) {
        candidates.push({
          source: `Article: ${article.title}`,
          label: article.title,
          url: reference.link,
        });
      }
    }
  }

  for (const link of importantLinks) {
    candidates.push({ source: "Important Link", label: link.title, url: link.url });
  }

  // Dedupe by URL so the same link showing up in five articles is only fetched once.
  const byUrl = new Map<string, typeof candidates>();
  for (const candidate of candidates) {
    const list = byUrl.get(candidate.url) ?? [];
    list.push(candidate);
    byUrl.set(candidate.url, list);
  }

  const uniqueUrls = Array.from(byUrl.keys());
  const statuses = await mapWithConcurrency(uniqueUrls, 5, async (url) => ({
    url,
    status: await checkUrl(url),
  }));
  const statusByUrl = new Map(statuses.map((s) => [s.url, s.status]));

  return candidates.map((candidate) => ({
    ...candidate,
    status: statusByUrl.get(candidate.url) ?? "broken",
  }));
}
