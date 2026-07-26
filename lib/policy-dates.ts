/** Effective dates for policy changes that affect displayed wording in code (not just
 * DB content) — read at call time, not module-load time, so a value derived from
 * `isPast(...)` reflects "now" on every request rather than freezing at server start. */

export const NAME_CHANGE_SUSPENSION_DATE = new Date("2026-08-01T00:00:00Z");

export function isPast(date: Date): boolean {
  return Date.now() >= date.getTime();
}
