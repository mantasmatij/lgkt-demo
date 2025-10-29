export const en = {
  common: {
    language: 'Language',
    lithuanian: 'Lithuanian',
    english: 'English',
    submit: 'Submit',
    optional: 'optional',
  },
  form: {
    title: 'Anonymous Company Form',
    section_company: 'Company',
    section_contact: 'Contact & Other',
    section_submitter: 'Submitter',
    requirements_applied: 'Requirements applied',
    reasons_optional: 'Reasons for underrepresentation (optional)',
    consent_label: 'I agree to the processing of my data.',
    submitting: 'Submitting form...'
  },
  fields: {
    company_name: 'Company name',
    company_code: 'Company code',
    country_iso2: 'Country (ISO2)',
    legal_form: 'Legal form',
    address: 'Address',
    registry: 'Registry',
    e_delivery_address: 'eDelivery address',
    requirements_link_optional: 'Requirements link (optional)',
    reporting_from: 'Reporting from',
    reporting_to: 'Reporting to',
    contact_name: 'Contact name',
    contact_email: 'Contact email',
    contact_phone: 'Contact phone',
    submitter_full_name: 'Full name',
    submitter_title: 'Title',
    submitter_phone: 'Phone',
    submitter_email: 'Email',
  },
  home: {
    title: 'LGKT Form - Company Reporting',
    welcome: 'Welcome',
  },
} as const;

export type EnDict = typeof en;
