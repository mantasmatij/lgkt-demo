BEGIN;

ALTER TABLE "attachments" DROP CONSTRAINT IF EXISTS "attachments_submission_id_submissions_id_fk";
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_submission_id_submissions_id_fk"
  FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "gender_balance_rows" DROP CONSTRAINT IF EXISTS "gender_balance_rows_submission_id_submissions_id_fk";
ALTER TABLE "gender_balance_rows" ADD CONSTRAINT "gender_balance_rows_submission_id_submissions_id_fk"
  FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "submission_measures" DROP CONSTRAINT IF EXISTS "submission_measures_submission_id_submissions_id_fk";
ALTER TABLE "submission_measures" ADD CONSTRAINT "submission_measures_submission_id_submissions_id_fk"
  FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "submission_meta" DROP CONSTRAINT IF EXISTS "submission_meta_submission_id_submissions_id_fk";
ALTER TABLE "submission_meta" ADD CONSTRAINT "submission_meta_submission_id_submissions_id_fk"
  FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "submission_organs" DROP CONSTRAINT IF EXISTS "submission_organs_submission_id_submissions_id_fk";
ALTER TABLE "submission_organs" ADD CONSTRAINT "submission_organs_submission_id_submissions_id_fk"
  FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT;