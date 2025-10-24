import { pgTable, text, timestamp, uuid, boolean, integer, date, varchar } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  country: varchar('country', { length: 2 }).notNull(),
  legalForm: text('legal_form'),
  address: text('address'),
  registry: text('registry'),
  eDeliveryAddress: text('e_delivery_address'),
  primaryContactName: text('primary_contact_name'),
  primaryContactEmail: text('primary_contact_email'),
  primaryContactPhone: text('primary_contact_phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyCode: text('company_code').notNull().references(() => companies.code),
  nameAtSubmission: text('name_at_submission').notNull(),
  country: varchar('country', { length: 2 }).notNull(),
  legalForm: text('legal_form'),
  address: text('address'),
  registry: text('registry'),
  eDeliveryAddress: text('e_delivery_address'),
  reportingFrom: date('reporting_from'),
  reportingTo: date('reporting_to'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  notes: text('notes'),
  consent: boolean('consent').notNull(),
  consentText: text('consent_text').notNull(),
  requirementsApplied: boolean('requirements_applied').notNull(),
  requirementsLink: text('requirements_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});

export const submissionOrgans = pgTable('submission_organs', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  organType: text('organ_type').notNull(),
  lastElectionDate: date('last_election_date'),
  plannedElectionDate: date('planned_election_date'),
});

export const genderBalanceRows = pgTable('gender_balance_rows', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  role: text('role').notNull(),
  women: integer('women').notNull(),
  men: integer('men').notNull(),
  total: integer('total').notNull(),
});

export const submissionMeasures = pgTable('submission_measures', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  name: text('name').notNull(),
  plannedResult: text('planned_result'),
  indicator: text('indicator'),
  indicatorValue: text('indicator_value'),
  indicatorUnit: text('indicator_unit'),
  year: text('year'),
});

export const attachments = pgTable('attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  type: text('type').notNull(),
  url: text('url'),
  fileName: text('file_name'),
  fileSize: integer('file_size'),
  contentType: text('content_type'),
  storageKey: text('storage_key'),
});

export const submissionMeta = pgTable('submission_meta', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  reasonsForUnderrepresentation: text('reasons_for_underrepresentation'),
  submitterName: text('submitter_name'),
  submitterTitle: text('submitter_title'),
  submitterPhone: text('submitter_phone'),
  submitterEmail: text('submitter_email'),
});
