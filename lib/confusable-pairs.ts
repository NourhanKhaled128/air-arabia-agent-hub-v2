import { NAME_CHANGE_SUSPENSION_DATE, isPast } from "./policy-dates";

export interface ConfusablePointer {
  targetSlug: string;
  targetTitle: string;
  note: string;
}

interface ConfusablePairSpec {
  targetSlug: string;
  targetTitle: string;
  note: string | { before: string; after: string; effectiveDate: Date };
}

// Shared across G9/9P/3L/E5 Name Change entries — the wording flips automatically once
// the company memo's suspension date arrives, without needing a redeploy that day.
const NAME_CHANGE_NOTE = {
  before:
    "A paid name change (different passenger, fare difference applies) is not the same as a free spelling correction (same passenger, sent to a Supervisor) — don't confuse the two queues.",
  after:
    "The paid name change option was suspended effective 1 Aug 2026 — only two free exceptions remain (spelling correction, genuine last-name change with proof), both sent to a Supervisor. 3O runs a separate, unaffected free/fee/rejected policy — don't confuse the two queues.",
  effectiveDate: NAME_CHANGE_SUSPENSION_DATE,
};

/**
 * Current article's slug prefix -> a pointer to the article it's commonly
 * confused with, plus the one-line distinction. Matched by prefix on the
 * *current* article only, since a few slugs carry a trailing creation
 * timestamp; target slugs are stored exact since we already know them.
 */
export const CONFUSABLE_PAIRS: Record<string, ConfusablePairSpec> = {
  "g9-name-change-g9": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: NAME_CHANGE_NOTE,
  },
  "9p-name-change-9p": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: NAME_CHANGE_NOTE,
  },
  "3l-name-change-3l": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: NAME_CHANGE_NOTE,
  },
  "e5-name-change-e5": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: NAME_CHANGE_NOTE,
  },
  "3o-name-change-3o": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: "This article covers the free/fee/rejected policy — the separate Name Correction decision flow has the actual case-by-case call-handling script (5 cases).",
  },
  "g9-ok-to-board-otb-g9": {
    targetSlug: "visa-applications-visa-change-bookings-all-hubs-1783838669014",
    targetTitle: "Visa Applications & Visa-Change Bookings",
    note: "Ok to Board just verifies an existing UAE visa copy for travel from India/Pakistan/Bangladesh — it isn't visa processing. Actual visa questions go to the consulate/embassy or an Air Arabia office (UAE visas only).",
  },
  "9p-ok-to-board-otb-9p": {
    targetSlug: "visa-applications-visa-change-bookings-all-hubs-1783838669014",
    targetTitle: "Visa Applications & Visa-Change Bookings",
    note: "Ok to Board just verifies an existing UAE visa copy for travel from India/Pakistan/Bangladesh — it isn't visa processing. Actual visa questions go to the consulate/embassy or an Air Arabia office (UAE visas only).",
  },
};

export function findConfusablePointer(slug: string): ConfusablePointer | null {
  const key = Object.keys(CONFUSABLE_PAIRS).find((prefix) => slug.startsWith(prefix));
  if (!key) return null;

  const spec = CONFUSABLE_PAIRS[key];
  const note =
    typeof spec.note === "string" ? spec.note : isPast(spec.note.effectiveDate) ? spec.note.after : spec.note.before;

  return { targetSlug: spec.targetSlug, targetTitle: spec.targetTitle, note };
}
