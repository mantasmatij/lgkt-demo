import type { CompanyFormInput } from '../validation/companyForm';

// Minimal mapper to preserve FR-016/FR-017 intent while shaping a backend-like payload.
// Note: Backend submission schema (validation package) isn't changed here.
// This mapper keeps removed fields present with empty values and includes companyType.

export function mapToSubmissionPayload(ui: CompanyFormInput) {
  return {
    // Company
    name: ui.name,
    code: ui.code,
    companyType: ui.companyType, // stable enum value
    legalForm: ui.legalForm,
    address: ui.address,
    registry: ui.registry,
    eDeliveryAddress: ui.eDeliveryAddress,

    // Removed UI fields retained as empty per FR-016
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',

    // Reporting period
    reportingFrom: ui.reportingFrom,
    reportingTo: ui.reportingTo,

    // Requirements & link
    requirementsApplied: ui.requirementsApplied,
    requirementsLink: ui.requirementsLink ?? '',

    // Sections
    organs: ui.organs || [],
    genderBalance: ui.genderBalance,
    measures: ui.measures || [],
    attachments: ui.attachments || [],

    // Section 12 (required)
    reasonsForUnderrepresentation: ui.reasonsForUnderrepresentation,

    // Consent & submitter
    consent: ui.consent,
    consentText: ui.consentText,
    submitter: ui.submitter,
    captchaToken: ui.captchaToken,
  };
}
