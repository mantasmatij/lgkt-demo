import { Client } from 'pg';

export default async function globalSetup() {
  const connectionString = process.env.DATABASE_URL || 'postgres://forma:forma@localhost:5432/forma';
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query('BEGIN');
    // Ensure submission child FKs cascade on delete (idempotent)
    const stmts = [
      `ALTER TABLE "attachments" DROP CONSTRAINT IF EXISTS "attachments_submission_id_submissions_id_fk";`,
      `ALTER TABLE "attachments" ADD CONSTRAINT "attachments_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`,

      `ALTER TABLE "gender_balance_rows" DROP CONSTRAINT IF EXISTS "gender_balance_rows_submission_id_submissions_id_fk";`,
      `ALTER TABLE "gender_balance_rows" ADD CONSTRAINT "gender_balance_rows_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`,

      `ALTER TABLE "submission_measures" DROP CONSTRAINT IF EXISTS "submission_measures_submission_id_submissions_id_fk";`,
      `ALTER TABLE "submission_measures" ADD CONSTRAINT "submission_measures_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`,

      `ALTER TABLE "submission_meta" DROP CONSTRAINT IF EXISTS "submission_meta_submission_id_submissions_id_fk";`,
      `ALTER TABLE "submission_meta" ADD CONSTRAINT "submission_meta_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`,

      `ALTER TABLE "submission_organs" DROP CONSTRAINT IF EXISTS "submission_organs_submission_id_submissions_id_fk";`,
      `ALTER TABLE "submission_organs" ADD CONSTRAINT "submission_organs_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;`,
    ];

    for (const sql of stmts) {
      await client.query(sql);
    }

    await client.query('COMMIT');
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch {}
    // Re-throw to fail fast if schema cannot be prepared
    throw e;
  } finally {
    await client.end();
  }
}
