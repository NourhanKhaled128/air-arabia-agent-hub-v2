-- Data fix: surface the Quality Feedback feature without requiring a manual admin
-- step — add its agent-facing sidebar link and home-dashboard widget row directly,
-- since both tables are seeded only once (SidebarLink via prisma/seed.ts, HomeWidget
-- via ensureSeeded() the first time the table is empty) and never revisited for new
-- entries added after initial setup. Idempotent.
INSERT INTO "public"."SidebarLink" ("label", "href", "icon", "section", "order", "visible", "createdAt", "updatedAt")
SELECT 'Quality Feedback', '/quality-feedback', 'Star', 'tools', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "public"."SidebarLink" WHERE "href" = '/quality-feedback');

INSERT INTO "public"."HomeWidget" ("type", "order", "size", "visible", "createdAt", "updatedAt")
SELECT 'qualityFeedback', 100, 'half', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "public"."HomeWidget" WHERE "type" = 'qualityFeedback');
