"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, SelectItem } from '@heroui/react';
import { OrgansSection, GenderBalanceSection, MeasuresSection, AttachmentsSection, InputField, TextareaField, CheckboxField, RadioField, SelectField, pillButtonClass } from 'ui';
import { useI18n } from '../providers/i18n-provider';
import { makeCompanyFormSchema, type CompanyFormInput } from '../../lib/validation/companyForm';
import { COMPANY_TYPE_VALUES, COMPANY_TYPE_LABEL_KEYS, COMPANY_TYPE_FIELD_LABEL_KEY } from '../../lib/constants/companyType';
import { MIN_DATE_STR } from '../../lib/validation/date';
import { twMerge } from 'tailwind-merge';

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
    const tv = t('validation');
    const schema = makeCompanyFormSchema({
      required: tv('required'),
      email: tv('invalid_email'),
      url: tv('invalid_url'),
      invalidDate: tv('invalid_date'),
      dateMin: tv('date_min'),
      dateOrder: tv('date_order'),
      consentRequired: tv('consent_required'),
      genderTotalMismatch: tv('gender_total_mismatch'),
      phoneMin: tv('phone_min'),
    });
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      // Build a smarter error map: one message per field, dot-path keys that match element ids
      const normalized: Record<string, string[]> = {};
      const issues = (parsed.error as unknown as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
      for (const iss of issues) {
        const key = iss.path.join('.');
        // Ignore array-level errors for nested sections; we show inline errors for their inner fields
        if (key === 'organs' || key === 'measures') continue;
        if (!key) continue;
        if (!normalized[key]) normalized[key] = [iss.message];
      }
      setErrors(normalized);
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
      // Transform UI form to API submission payload shape
      const payload = {
        name: form.name,
        code: form.code,
        country: (form as unknown as { country?: string }).country ?? 'LT',
        companyType: form.companyType,
        legalForm: form.legalForm,
        address: form.address,
        registry: form.registry,
        eDeliveryAddress: form.eDeliveryAddress,
        reportingFrom: form.reportingFrom,
        reportingTo: form.reportingTo,
        contactName: form.submitter.name,
        contactEmail: form.submitter.email,
        contactPhone: form.submitter.phone,
        requirementsApplied: form.requirementsApplied,
        requirementsLink: form.requirementsLink,
        organs: form.organs,
        genderBalance: form.genderBalance,
        measures: form.measures,
        attachments: form.attachments,
        reasonsForUnderrepresentation: form.reasonsForUnderrepresentation,
        consent: form.consent,
        consentText: form.consentText,
        submitter: form.submitter,
        captchaToken: form.captchaToken,
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setResult(err?.message || tc('submission_failed'));
      } else {
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
      
        {result && <Card className="p-3 text-sm" role="alert">{result}</Card>}
        {Object.keys(errors).length > 0 && (
          <Card className="p-4 mb-3 bg-red-50 border-red-200" role="alert">
            <h2 id="error-summary-title" tabIndex={-1} className="font-semibold text-red-800 mb-2">
              {tform('error_summary_heading') as unknown as string}
            </h2>
            <ul className="list-disc pl-5 text-sm text-red-700">
              {Object.entries(errors).slice(0, 5).map(([k, msgs]) => (
                <li key={k}>{msgs[0]}</li>
              ))}
            </ul>
          </Card>
        )}
      
        <form onSubmit={onSubmit} noValidate>
          <Card className="p-6">
            <div className="flex flex-col gap-3">
              {/* Company fields vertically stacked (single column) */}
              <div className="flex flex-col gap-3">
                <InputField
                  id="name"
                  name="name"
                  label={`1.1 ${tf('company_name')}`}
                  labelClassName="font-bold"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.[0]}
                  isRequired
                />
                <InputField
                  id="code"
                  name="code"
                  label={`1.2 ${tf('company_code')}`}
                  labelClassName="font-bold"
                  value={form.code}
                  onChange={(e) => update('code', e.target.value)}
                  isInvalid={!!errors.code}
                  errorMessage={errors.code?.[0]}
                  isRequired
                />
                <SelectField
                  id="companyType"
                  name="companyType"
                  label={`1.3 ${tf(COMPANY_TYPE_FIELD_LABEL_KEY as keyof FieldsDict)}`}
                  labelClassName="font-bold"
                  selectedKeys={[form.companyType]}
                  isInvalid={!!errors.companyType}
                  errorMessage={errors.companyType?.[0]}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys as Set<string>)[0] as CompanyFormInput['companyType'];
                    if (k) update('companyType', k);
                  }}
                  isRequired
                  classNames={{
                    // Enforce a wider minimum width; allow shrink on very small screens
                    trigger: 'min-w-64 sm:min-w-[18rem]',
                  }}
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
                  label={`2. ${tf('legal_form')}`}
                  labelClassName="font-bold"
                  isInvalid={!!errors.legalForm}
                  errorMessage={errors.legalForm?.[0]}
                  value={form.legalForm}
                  onChange={(e) => update('legalForm', e.target.value)}
                  isRequired
                />
                <InputField
                  id="address"
                  name="address"
                  label={`3. ${tf('address')}`}
                  labelClassName="font-bold"
                  isInvalid={!!errors.address}
                  errorMessage={errors.address?.[0]}
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  isRequired
                />
                <InputField
                  id="registry"
                  name="registry"
                  label={`4. ${tf('registry')}`}
                  labelClassName="font-bold"
                  isInvalid={!!errors.registry}
                  errorMessage={errors.registry?.[0]}
                  value={form.registry}
                  onChange={(e) => update('registry', e.target.value)}
                  isRequired
                />
                <InputField
                  id="eDeliveryAddress"
                  name="eDeliveryAddress"
                  label={`5. ${tf('e_delivery_address')}`}
                  labelClassName="font-bold"
                  isInvalid={!!errors.eDeliveryAddress}
                  errorMessage={errors.eDeliveryAddress?.[0]}
                  value={form.eDeliveryAddress}
                  onChange={(e) => update('eDeliveryAddress', e.target.value)}
                  isRequired
                />
              </div>

              {/* Reporting period */}
              <div className="font-bold">{`6. ${tform('reporting_period_heading') as unknown as string}`}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  id="reportingFrom"
                  name="reportingFrom"
                  type="date"
                  label={tf('reporting_from')}
                  labelClassName="font-normal"
                  isInvalid={!!errors.reportingFrom}
                  errorMessage={errors.reportingFrom?.[0]}
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
                  isInvalid={!!errors.reportingTo}
                  errorMessage={errors.reportingTo?.[0]}
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
            errors={errors}
            labels={{
              title: `7. ${tform('section_organs') as unknown as string}`,
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
              title: `8. ${tform('section_gender') as unknown as string}`,
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
                <div className="h-full absolute left-0 top-0" style={{ width: `${genderTotals.wp}%`, backgroundColor: '#F1BA3C' }} />
                <div className="h-full absolute right-0 top-0" style={{ width: `${genderTotals.mp}%`, backgroundColor: '#4D5C71' }} />
              </div>
              <p className="text-sm">
                {tf('women')}: {genderTotals.women} ({genderTotals.wp}%) — {tf('men')}: {genderTotals.men} ({genderTotals.mp}%) — {tf('total')}: {genderTotals.total}
              </p>
            </div>
          </Card>

          {/* 9. Requirements applied: switch to radio buttons */}
          <Card className="p-6">
            <div className="flex flex-col gap-3">
              <div className="font-bold">{`9. ${tform('requirements_applied_question')}`}</div>
              <div className="flex items-center gap-6">
                <div className="inline-flex items-center gap-2">
                  <RadioField
                    id="requirements-applied-yes"
                    name="requirementsApplied"
                    checked={!!form.requirementsApplied}
                    onChange={() => update('requirementsApplied', true)}
                    ariaLabel={tform('requirements_yes')}
                  />
                  <span>{tform('requirements_yes')}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <RadioField
                    id="requirements-applied-no"
                    name="requirementsApplied"
                    checked={!form.requirementsApplied}
                    onChange={() => update('requirementsApplied', false)}
                    ariaLabel={tform('requirements_no')}
                  />
                  <span>{tform('requirements_no')}</span>
                </div>
              </div>
            </div>
          </Card>

          

          {/* Attachments before Measures with localized labels */}
          <AttachmentsSection 
            value={form.attachments || []} 
            onChange={(rows) => update('attachments', rows)}
            labels={{
              title: `10. ${tform('attachments_title') as unknown as string}`,
              link_input_label: '' as unknown as string,
              add_link: tform('attachments_add_link_button') as unknown as string,
              upload_click_to: tform('attachments_click_to_upload') as unknown as string,
              upload_or_drag: tform('attachments_or_drag_and_drop') as unknown as string,
              upload_multiple_supported: tform('attachments_multiple_supported') as unknown as string,
            }}
          />

          {/* Measures moved below Attachments; include example link at the top */}
          <MeasuresSection
            value={form.measures || []}
            onChange={(rows) => update('measures', rows)}
            errors={errors}
            labels={{
              title: `11. ${tform('section_measures') as unknown as string}`,
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
            topSlot={
              <div className="text-sm">
                <a
                  href={process.env.NEXT_PUBLIC_MEASURES_EXAMPLE_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-gray-600 font-semibold"
                >
                  {tform('measures_example_link_text')}
                </a>
              </div>
            }
            // TODO(US1/T004): Ensure internal 'name' & 'planned_result' fields render as 10-line textareas.
          />

          {/* Section 12: Reasons (placed above Submitter section) */}
          <Card className={twMerge("p-6")}>
            <div className="flex flex-col gap-3">
              {/* TODO(US1/T004): 10-line textarea styling for reasons field; enforce consistent border and fixed height. */}
              <TextareaField
                id="reasonsForUnderrepresentation"
                name="reasonsForUnderrepresentation"
                label={`12. ${tform('reasons_required')}`}
                labelClassName='font-bold'
                isInvalid={!!errors.reasonsForUnderrepresentation}
                errorMessage={errors.reasonsForUnderrepresentation?.[0]}
                value={form.reasonsForUnderrepresentation ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update('reasonsForUnderrepresentation', e.target.value || '')}
                minRows={10}
                maxRows={10}
                isRequired
                classNames={{
                  inputWrapper: "rounded-2xl border-2 border-black px-4 py-3 min-h-[17rem] bg-white",
                  input: 'resize-none overflow-y-auto leading-6',
                }}
              />
            </div>
          </Card>

          {/* Consent moved below Reasons */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-md">{tform('consent_label')}</span>
              <CheckboxField
                id="consent"
                name="consent"
                checked={form.consent}
                onChange={(checked) => update('consent', checked)}
                ariaLabel={tform('consent_label')}
              />
            </div>
              {errors.consent?.[0] && (
                <div className="text-sm text-red-600 mt-2">{errors.consent[0]}</div>
              )}
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
                  isInvalid={!!errors['submitter.name']}
                  errorMessage={errors['submitter.name']?.[0]}
                  value={form.submitter.name}
                  onChange={(e) => update('submitter', { ...form.submitter, name: e.target.value })}
                  isRequired
                />
                <InputField
                  id="submitter.title"
                  name="submitter.title"
                  label={tf('submitter_title')}
                  isInvalid={!!errors['submitter.title']}
                  errorMessage={errors['submitter.title']?.[0]}
                  value={form.submitter.title ?? ''}
                  onChange={(e) => update('submitter', { ...form.submitter, title: e.target.value })}
                  isRequired
                />
                <InputField
                  id="submitter.phone"
                  name="submitter.phone"
                  label={tf('submitter_phone')}
                  isInvalid={!!errors['submitter.phone']}
                  errorMessage={errors['submitter.phone']?.[0]}
                  value={form.submitter.phone}
                  onChange={(e) => update('submitter', { ...form.submitter, phone: e.target.value })}
                  isRequired
                />
                <InputField
                  id="submitter.email"
                  name="submitter.email"
                  type="email"
                  label={tf('submitter_email')}
                  isInvalid={!!errors['submitter.email']}
                  errorMessage={errors['submitter.email']?.[0]}
                  value={form.submitter.email}
                  onChange={(e) => update('submitter', { ...form.submitter, email: e.target.value })}
                  isRequired
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
