-- AlterTable
-- Optional before/after JSON snapshots so the Audit Trail can show a diff, not just
-- that a change happened. Populated only by Article and Category update/delete
-- actions for now; nullable so every existing logAction() call site still works.
ALTER TABLE "public"."AuditLog" ADD COLUMN "before" JSONB,
ADD COLUMN "after" JSONB;
