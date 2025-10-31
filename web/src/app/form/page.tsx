"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, SelectItem } from '@heroui/react';
import { OrgansSection, GenderBalanceSection, MeasuresSection, AttachmentsSection, ErrorSummary, InputField, TextareaField, CheckboxField, SelectField, pillButtonClass } from 'ui';
import { useI18n } from '../providers/i18n-provider';
import { companyFormSchema, type CompanyFormInput } from '../../lib/validation/companyForm';
import { COMPANY_TYPE_VALUES, COMPANY_TYPE_LABEL_KEYS, COMPANY_TYPE_FIELD_LABEL_KEY } from '../../lib/constants/companyType';
import { MIN_DATE_STR } from '../../lib/validation/date';

// Input styling is handled by shared UI components (InputField/TextareaField)

export default function PublicFormPage() {
  const router = useRouter();
  const { t } = useI18n();
  type FieldsDict = (typeof import('../../i18n/dictionaries').dictionaries)['lt']['fields'];
  const tf = <K extends keyof FieldsDict>(k: K) => t('fields')(k as K);
  const tc = t('common');
  const tform = t('form');
  const [form, setForm] = React.useState<CompanyFormInput>({
    // Company
    name: '',
    code: '',
    companyType: 'LISTED',
    legalForm: '',
    address: '',
    registry: '',
    eDeliveryAddress: '',

    // Reporting period
    reportingFrom: '',
    reportingTo: '',

    // Requirements & link
    requirementsApplied: false,
    requirementsLink: undefined,

    // Organs & gender & measures & attachments
    organs: [],
    genderBalance: [
      { role: 'CEO', women: 0, men: 0, total: 0 },
      { role: 'BOARD', women: 0, men: 0, total: 0 },
      { role: 'SUPERVISORY_BOARD', women: 0, men: 0, total: 0 },
    ],
    measures: [],
    attachments: [],

    // Section 12
    reasonsForUnderrepresentation: '',

    // Consent & submitter
    consent: false,
    consentText: tform('consent_text') as unknown as string,
    submitter: { name: '', title: '', phone: '', email: '' },
    captchaToken: 'dev',
  });
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  function update<K extends keyof CompanyFormInput>(key: K, value: CompanyFormInput[K]) {
    setForm((prev: CompanyFormInput) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setErrors({});
    const parsed = companyFormSchema.safeParse(form);
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
      const res = await fetch('/api/submitCompanyForm', {
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

  // Compute overall gender percentages for visualization
  const genderTotals = React.useMemo(() => {
    const acc = form.genderBalance.reduce(
      (a, r) => ({ women: a.women + (r.women || 0), men: a.men + (r.men || 0), total: a.total + (r.total || 0) }),
      { women: 0, men: 0, total: 0 }
    );
    const wp = acc.total > 0 ? Math.round((acc.women / acc.total) * 100) : 0;
    const mp = acc.total > 0 ? 100 - wp : 0;
    return { ...acc, wp, mp };
  }, [form.genderBalance]);

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

              {/* Company fields vertically stacked (single column) */}
              <div className="flex flex-col gap-3">
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
                <SelectField
                  id="companyType"
                  name="companyType"
                  label={tf(COMPANY_TYPE_FIELD_LABEL_KEY as keyof FieldsDict)}
                  selectedKeys={[form.companyType]}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys as Set<string>)[0] as CompanyFormInput['companyType'];
                    if (k) update('companyType', k);
                  }}
                  isRequired
                >
                  {COMPANY_TYPE_VALUES.map((val: (typeof COMPANY_TYPE_VALUES)[number]) => (
                    <SelectItem key={val}>
                      {tf(COMPANY_TYPE_LABEL_KEYS[val] as keyof FieldsDict)}
                    </SelectItem>
                  ))}
                </SelectField>
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
              </div>

              {/* Reporting period */}
              <div className="font-semibold">{tform('reporting_period_heading') as unknown as string}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  id="reportingFrom"
                  name="reportingFrom"
                  type="date"
                  label={tf('reporting_from')}
                  labelClassName="font-normal"
                  value={form.reportingFrom}
                  onChange={(e) => update('reportingFrom', e.target.value)}
                  min={MIN_DATE_STR}
                  isRequired
                />
                <InputField
                  id="reportingTo"
                  name="reportingTo"
                  type="date"
                  label={tf('reporting_to')}
                  labelClassName="font-normal"
                  value={form.reportingTo}
                  onChange={(e) => update('reportingTo', e.target.value)}
                  min={MIN_DATE_STR}
                  isRequired
                />
              </div>
              
            </div>
          </Card>

          <OrgansSection
            value={form.organs || []}
            onChange={(rows) => update('organs', rows)}
            labels={{
              title: tform('section_organs') as unknown as string,
              organ_type: tf('organ_type') as unknown as string,
              last_election_date: tf('last_election_date') as unknown as string,
              planned_election_date: tf('planned_election_date') as unknown as string,
              option_VALDYBA: tf('organ_option_valdyba') as unknown as string,
              option_STEBETOJU_TARYBA: tf('organ_option_stebetoju_taryba') as unknown as string,
              add: tf('add_organ') as unknown as string,
              remove: tf('remove_organ') as unknown as string,
            }}
          />

          <GenderBalanceSection
            value={form.genderBalance}
            onChange={(rows) => update('genderBalance', rows)}
            labels={{
              title: tform('section_gender') as unknown as string,
              women: tf('women') as unknown as string,
              men: tf('men') as unknown as string,
              total: tf('total') as unknown as string,
              roles: {
                CEO: tf('role_ceo') as unknown as string,
                BOARD: tf('role_board') as unknown as string,
                SUPERVISORY_BOARD: tf('role_supervisory_board') as unknown as string,
              },
            }}
            rowVisualization={false}
          />

          {/* Overall gender distribution visualization */}
          <Card className="p-4">
            <div className="flex flex-col gap-2">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                <div className="h-full bg-pink-400 absolute left-0 top-0" style={{ width: `${genderTotals.wp}%` }} />
                <div className="h-full bg-blue-400 absolute right-0 top-0" style={{ width: `${genderTotals.mp}%` }} />
              </div>
              <p className="text-sm">
                {tf('women')}: {genderTotals.women} ({genderTotals.wp}%) — {tf('men')}: {genderTotals.men} ({genderTotals.mp}%) — {tf('total')}: {genderTotals.total}
              </p>
            </div>
          </Card>

          {/* Requirements applied moved here with bold label */}
          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <div className="font-semibold">{tform('requirements_applied_question')}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-0 select-none">spacer</span>
                <CheckboxField
                  id="requirementsApplied"
                  name="requirementsApplied"
                  checked={form.requirementsApplied}
                  onChange={(checked) => update('requirementsApplied', checked)}
                  ariaLabel={tform('requirements_applied_question')}
                />
              </div>
            </div>
          </Card>

          {/* Measures example link (Section 11) */}
          <Card className="p-4">
            <p className="text-sm">
              <span className="mr-2">{tform('measures_example_label')}</span>
              <a
                href={process.env.NEXT_PUBLIC_MEASURES_EXAMPLE_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {tform('measures_example_link_text')}
              </a>
            </p>
          </Card>

          {/* Attachments before Measures with localized labels */}
          <AttachmentsSection 
            value={form.attachments || []} 
            onChange={(rows) => update('attachments', rows)}
            labels={{
              title: tform('attachments_title') as unknown as string,
              link_input_label: tform('attachments_link_label') as unknown as string,
              add_link: tform('attachments_add_link_button') as unknown as string,
            }}
          />

          {/* Measures moved below Attachments */}
          <MeasuresSection
            value={form.measures || []}
            onChange={(rows) => update('measures', rows)}
            labels={{
              title: tform('section_measures') as unknown as string,
              no_measures: tf('no_measures') as unknown as string,
              name: tf('measure_name') as unknown as string,
              planned_result: tf('planned_result') as unknown as string,
              planned_indicator: tf('planned_indicator') as unknown as string,
              indicator_value: tf('indicator_value') as unknown as string,
              indicator_unit: tf('indicator_unit') as unknown as string,
              year: tf('year') as unknown as string,
              add: tf('add_measure') as unknown as string,
              remove: tf('remove_measure') as unknown as string,
            }}
          />

          {/* Section 12: Reasons (placed above Submitter section) */}
          <Card className="p-6">
            <div className="flex flex-col gap-3">
              <TextareaField
                id="reasonsForUnderrepresentation"
                name="reasonsForUnderrepresentation"
                label={tform('reasons_required')}
                value={form.reasonsForUnderrepresentation ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update('reasonsForUnderrepresentation', e.target.value || '')}
                disableAutosize
                minRows={4}
                isRequired
              />
            </div>
          </Card>

          {/* Submitter */}
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
