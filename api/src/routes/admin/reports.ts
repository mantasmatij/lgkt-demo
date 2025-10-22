import { Router } from 'express';
import { getDb, submissions, companies } from 'db';
import { and, gte, lte, sql } from 'drizzle-orm';
import { requireAuth } from '../../middleware/auth';
import { stringify } from 'csv-stringify';

export const adminReportsRouter = Router();

// All admin routes require authentication
adminReportsRouter.use(requireAuth);

adminReportsRouter.get('/export.csv', async (req, res, next) => {
  try {
    const fromDate = req.query.from as string;
    const toDate = req.query.to as string;

    if (!fromDate || !toDate) {
      return res.status(400).json({ 
        code: 'VALIDATION_ERROR', 
        message: 'Date range required (from and to query params)' 
      });
    }

    const db = getDb();

    // Build where conditions
    const conditions = [
      gte(submissions.createdAt, new Date(fromDate)),
      lte(submissions.createdAt, new Date(toDate)),
    ];

    // Query submissions with company data
    const rows = await db
      .select({
        submissionId: submissions.id,
        companyCode: companies.code,
        companyName: companies.name,
        country: submissions.country,
        legalForm: submissions.legalForm,
        reportingFrom: submissions.reportingFrom,
        reportingTo: submissions.reportingTo,
        contactName: submissions.contactName,
        contactEmail: submissions.contactEmail,
        requirementsApplied: submissions.requirementsApplied,
        consent: submissions.consent,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .leftJoin(companies, sql`${submissions.companyCode} = ${companies.code}`)
      .where(and(...conditions))
      .orderBy(submissions.createdAt);

    // Set CSV headers
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="submissions-${fromDate}-${toDate}.csv"`);

    // Create CSV stringifier
    const stringifier = stringify({
      header: true,
      columns: [
        { key: 'submissionId', header: 'Submission ID' },
        { key: 'companyCode', header: 'Company Code' },
        { key: 'companyName', header: 'Company Name' },
        { key: 'country', header: 'Country' },
        { key: 'legalForm', header: 'Legal Form' },
        { key: 'reportingFrom', header: 'Reporting From' },
        { key: 'reportingTo', header: 'Reporting To' },
        { key: 'contactName', header: 'Contact Name' },
        { key: 'contactEmail', header: 'Contact Email' },
        { key: 'requirementsApplied', header: 'Requirements Applied' },
        { key: 'consent', header: 'Consent' },
        { key: 'createdAt', header: 'Submitted At' },
      ],
    });

    // Pipe to response
    stringifier.pipe(res);

    // Write rows
    for (const row of rows) {
      stringifier.write(row);
    }

    stringifier.end();
  } catch (err) {
    return next(err);
  }
});
