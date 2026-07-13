export interface ConfusablePointer {
  targetSlug: string;
  targetTitle: string;
  note: string;
}

/**
 * Current article's slug prefix -> a pointer to the article it's commonly
 * confused with, plus the one-line distinction. Matched by prefix on the
 * *current* article only, since a few slugs carry a trailing creation
 * timestamp; target slugs are stored exact since we already know them.
 */
export const CONFUSABLE_PAIRS: Record<string, ConfusablePointer> = {
  "g9-name-change-g9": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: "A paid name change (different passenger, fare difference applies) is not the same as a free spelling correction (same passenger, sent to a Supervisor) — don't confuse the two queues.",
  },
  "9p-name-change-9p": {
    targetSlug: "3o-name-correction-request-decision-flow-3o",
    targetTitle: "3O Name Correction — Decision Flow",
    note: "A paid name change (different passenger, fare difference applies) is not the same as a free spelling correction (same passenger, sent to a Supervisor) — don't confuse the two queues.",
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
  return key ? CONFUSABLE_PAIRS[key] : null;
}
