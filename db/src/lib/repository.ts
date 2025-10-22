import { getDb } from './client';
import { attachments, genderBalanceRows, submissionMeasures, submissionMeta, submissionOrgans, submissions } from './schema';

export type SubmissionTree = {
  submission: {
    companyCode: string;
    nameAtSubmission: string;
    country: string;
    legalForm?: string | null;
    address?: string | null;
    registry?: string | null;
    eDeliveryAddress?: string | null;
    reportingFrom?: string | null; // ISO date
    reportingTo?: string | null;   // ISO date
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    notes?: string | null;
    consent: boolean;
    consentText: string;
    requirementsApplied: boolean;
    requirementsLink?: string | null;
  };
  organs?: Array<{ organType: string; lastElectionDate?: string | null; plannedElectionDate?: string | null }>;
  genderBalance: Array<{ role: string; women: number; men: number; total: number }>;
  measures?: Array<{ name: string; plannedResult?: string | null; indicator?: string | null; indicatorValue?: string | null; indicatorUnit?: string | null; year?: string | null }>;
  attachments?: Array<
    | { type: 'LINK'; url: string }
    | { type: 'FILE'; fileName: string; fileSize: number; contentType: string; storageKey: string }
  >;
  meta?: {
    reasonsForUnderrepresentation?: string | null;
    submitterName?: string | null;
    submitterTitle?: string | null;
    submitterPhone?: string | null;
    submitterEmail?: string | null;
  };
};

export async function createSubmissionTree(tree: SubmissionTree) {
  const db = getDb();
  // Insert submission
  const [sub] = await db
    .insert(submissions)
    .values({
      companyCode: tree.submission.companyCode,
      nameAtSubmission: tree.submission.nameAtSubmission,
      country: tree.submission.country,
      legalForm: tree.submission.legalForm ?? null,
      address: tree.submission.address ?? null,
      registry: tree.submission.registry ?? null,
      eDeliveryAddress: tree.submission.eDeliveryAddress ?? null,
  reportingFrom: tree.submission.reportingFrom ?? null,
  reportingTo: tree.submission.reportingTo ?? null,
      contactName: tree.submission.contactName,
      contactEmail: tree.submission.contactEmail,
      contactPhone: tree.submission.contactPhone,
      notes: tree.submission.notes ?? null,
      consent: tree.submission.consent,
      consentText: tree.submission.consentText,
      requirementsApplied: tree.submission.requirementsApplied,
      requirementsLink: tree.submission.requirementsLink ?? null,
    })
    .returning({ id: submissions.id });

  const submissionId = sub.id;

  // Children inserts (ignore empty arrays)
  if (tree.organs && tree.organs.length) {
    await db.insert(submissionOrgans).values(
      tree.organs.map((o) => ({
        submissionId,
        organType: o.organType,
        lastElectionDate: o.lastElectionDate ?? null,
        plannedElectionDate: o.plannedElectionDate ?? null,
      }))
    );
  }

  if (tree.genderBalance && tree.genderBalance.length) {
    await db.insert(genderBalanceRows).values(
      tree.genderBalance.map((g) => ({
        submissionId,
        role: g.role,
        women: g.women,
        men: g.men,
        total: g.total,
      }))
    );
  }

  if (tree.measures && tree.measures.length) {
    await db.insert(submissionMeasures).values(
      tree.measures.map((m) => ({
        submissionId,
        name: m.name,
        plannedResult: m.plannedResult ?? null,
        indicator: m.indicator ?? null,
        indicatorValue: m.indicatorValue ?? null,
        indicatorUnit: m.indicatorUnit ?? null,
        year: m.year ?? null,
      }))
    );
  }

  if (tree.attachments && tree.attachments.length) {
    await db.insert(attachments).values(
      tree.attachments.map((a) =>
        a.type === 'LINK'
          ? {
              submissionId,
              type: 'LINK',
              url: a.url,
              fileName: null,
              fileSize: null,
              contentType: null,
              storageKey: null,
            }
          : {
              submissionId,
              type: 'FILE',
              url: null,
              fileName: a.fileName,
              fileSize: a.fileSize,
              contentType: a.contentType,
              storageKey: a.storageKey,
            }
      )
    );
  }

  if (tree.meta) {
    await db.insert(submissionMeta).values({
      submissionId,
      reasonsForUnderrepresentation: tree.meta.reasonsForUnderrepresentation ?? null,
      submitterName: tree.meta.submitterName ?? null,
      submitterTitle: tree.meta.submitterTitle ?? null,
      submitterPhone: tree.meta.submitterPhone ?? null,
      submitterEmail: tree.meta.submitterEmail ?? null,
    });
  }

  return { id: submissionId };
}
