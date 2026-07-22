-- Data fix: the "manage_quality" permission key was added after the top-tier admin
-- role was originally seeded, so it never picked it up (seeding only sets permissions
-- on create, not on existing rows). Grant it to any role that already holds both
-- manage_roles and manage_settings — i.e. the full-admin tier, regardless of its name —
-- rather than assuming a specific role name. Idempotent.
UPDATE "public"."Role"
SET "permissions" = array_append("permissions", 'manage_quality')
WHERE 'manage_roles' = ANY("permissions")
  AND 'manage_settings' = ANY("permissions")
  AND NOT ('manage_quality' = ANY("permissions"));
