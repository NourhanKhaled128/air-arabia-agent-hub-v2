-- Quality review scores are entered manually as a 0-100 point score (not a 1-5 pick),
-- so the column needs to hold fractional values.
ALTER TABLE "public"."QualityReview" ALTER COLUMN "rating" TYPE DOUBLE PRECISION;
