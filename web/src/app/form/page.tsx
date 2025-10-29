"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@heroui/react';
import { OrgansSection, GenderBalanceSection, MeasuresSection, AttachmentsSection, ErrorSummary, InputField, TextareaField, CheckboxField, pillButtonClass } from 'ui';
import { submissionSchema, type SubmissionInput } from 'validation';
import { useI18n } from '../providers/i18n-provider';

// Input styling is handled by shared UI components (InputField/TextareaField)

export default function PublicFormPage() {
  const router = useRouter();
  const { t } = useI18n();
  type FieldsDict = (typeof import('../../i18n/dictionaries').dictionaries)['lt']['fields'];
  const tf = <K extends keyof FieldsDict>(k: K) => t('fields')(k as K);
  const tc = t('common');
  const tform = t('form');
  const [form, setForm] = React.useState<SubmissionInput>({
    name: '',
    code: '',
    country: 'LT',
    legalForm: '',
    address: '',
    registry: '',
    eDeliveryAddress: '',
    reportingFrom: '',
    reportingTo: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requirementsApplied: false,
    requirementsLink: undefined,
    organs: [],
    genderBalance: [
      { role: 'CEO', women: 0, men: 0, total: 0 },
      { role: 'BOARD', women: 0, men: 0, total: 0 },
      { role: 'SUPERVISORY_BOARD', women: 0, men: 0, total: 0 },
    ],
    measures: [],
    attachments: [],
    reasonsForUnderrepresentation: '',
    consent: false,
  consentText: tform('consent_text') as unknown as string,
    submitter: { name: '', title: '', phone: '', email: '' },
    captchaToken: 'dev',
  });
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  function update<K extends keyof SubmissionInput>(key: K, value: SubmissionInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setErrors({});
    const parsed = submissionSchema.safeParse(form);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      setErrors(f);
      // Focus error summary for screen readers
      setTimeout(() => {
        const errorSummary = document.getElementById('error-summary-title');
        if (errorSummary) {
          errorSummary.focus();
        }
      }, 100);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
  const err = await res.json().catch(() => ({}));
  setResult(err?.message || tc('submission_failed'));
      } else {
        // Redirect to success page on successful submission
        router.push('/form/success');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold mb-2">{tform('title')}</h1>
      
      <ErrorSummary errors={errors} />
      
      {result && <Card className="p-3 text-sm" role="alert">{result}</Card>}
      
      <form onSubmit={onSubmit} noValidate>
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">{tform('section_company')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                id="name"
                name="name"
                label={tf('company_name')}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.[0]}
                isRequired
              />
              <InputField
                id="code"
                name="code"
                label={tf('company_code')}
                value={form.code}
                onChange={(e) => update('code', e.target.value)}
                isInvalid={!!errors.code}
                errorMessage={errors.code?.[0]}
                isRequired
              />
              <InputField
                id="country"
                name="country"
                label={tf('country_iso2')}
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                isInvalid={!!errors.country}
                errorMessage={errors.country?.[0]}
                isRequired
              />
              <InputField
                id="legalForm"
                name="legalForm"
                label={tf('legal_form')}
                value={form.legalForm}
                onChange={(e) => update('legalForm', e.target.value)}
                isRequired
              />
              <InputField
                id="address"
                name="address"
                label={tf('address')}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                isRequired
              />
              <InputField
                id="registry"
                name="registry"
                label={tf('registry')}
                value={form.registry}
                onChange={(e) => update('registry', e.target.value)}
                isRequired
              />
              <InputField
                id="eDeliveryAddress"
                name="eDeliveryAddress"
                label={tf('e_delivery_address')}
                value={form.eDeliveryAddress}
                onChange={(e) => update('eDeliveryAddress', e.target.value)}
                isRequired
              />
              <InputField
                id="requirementsLink"
                name="requirementsLink"
                type="url"
                label={tf('requirements_link_optional')}
                value={form.requirementsLink ?? ''}
                onChange={(e) => update('requirementsLink', e.target.value || undefined)}
              />
              <InputField
                id="reportingFrom"
                name="reportingFrom"
                type="date"
                label={tf('reporting_from')}
                value={form.reportingFrom}
                onChange={(e) => update('reportingFrom', e.target.value)}
                isRequired
              />
              <InputField
                id="reportingTo"
                name="reportingTo"
                type="date"
                label={tf('reporting_to')}
                value={form.reportingTo}
                onChange={(e) => update('reportingTo', e.target.value)}
                isRequired
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tform('requirements_applied')}</span>
              <CheckboxField
                id="requirementsApplied"
                name="requirementsApplied"
                checked={form.requirementsApplied}
                onChange={(checked) => update('requirementsApplied', checked)}
                ariaLabel={tform('requirements_applied')}
              />
            </div>
          </div>
        </Card>

  <OrgansSection value={form.organs || []} onChange={(rows) => update('organs', rows)} />
  <GenderBalanceSection value={form.genderBalance} onChange={(rows) => update('genderBalance', rows)} />
  <MeasuresSection value={form.measures || []} onChange={(rows) => update('measures', rows)} />
  <AttachmentsSection value={form.attachments || []} onChange={(rows) => update('attachments', rows)} />

        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">{tform('section_contact')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField 
              id="contactName"
              name="contactName"
              label={tf('contact_name')} 
              value={form.contactName} 
              onChange={(e) => update('contactName', e.target.value)}
              isRequired
            />
            <InputField 
              id="contactEmail"
              name="contactEmail"
              type="email" 
              label={tf('contact_email')} 
              value={form.contactEmail} 
              onChange={(e) => update('contactEmail', e.target.value)}
              isRequired
            />
            <InputField 
              id="contactPhone"
              name="contactPhone"
              label={tf('contact_phone')} 
              value={form.contactPhone} 
              onChange={(e) => update('contactPhone', e.target.value)}
              isRequired
            />
          </div>
          <TextareaField 
            id="reasonsForUnderrepresentation"
            name="reasonsForUnderrepresentation"
            label={tform('reasons_optional')} 
            value={form.reasonsForUnderrepresentation ?? ''} 
            onChange={(e) => update('reasonsForUnderrepresentation', e.target.value || undefined)}
            disableAutosize
            minRows={4}
            classNames={{ inputWrapper: "min-h-32 max-h-32", input: "resize-none" }}
          />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">{tform('section_submitter')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField 
              id="submitter.name"
              name="submitter.name"
              label={tf('submitter_full_name')} 
              value={form.submitter.name} 
              onChange={(e) => update('submitter', { ...form.submitter, name: e.target.value })}
              isRequired
            />
            <InputField 
              id="submitter.title"
              name="submitter.title"
              label={tf('submitter_title')} 
              value={form.submitter.title ?? ''} 
              onChange={(e) => update('submitter', { ...form.submitter, title: e.target.value })}
            />
            <InputField 
              id="submitter.phone"
              name="submitter.phone"
              label={tf('submitter_phone')} 
              value={form.submitter.phone} 
              onChange={(e) => update('submitter', { ...form.submitter, phone: e.target.value })}
              isRequired
            />
            <InputField 
              id="submitter.email"
              name="submitter.email"
              type="email" 
              label={tf('submitter_email')} 
              value={form.submitter.email} 
              onChange={(e) => update('submitter', { ...form.submitter, email: e.target.value })}
              isRequired
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{tform('consent_label')}</span>
            <CheckboxField
              id="consent"
              name="consent"
              checked={form.consent}
              onChange={(checked) => update('consent', checked)}
              ariaLabel={tform('consent_label')}
            />
          </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className={pillButtonClass}
            aria-label={submitting ? tform('submitting') : tc('submit')}
            disabled={submitting}
          >
            {tc('submit')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
