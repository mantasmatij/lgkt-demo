"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Checkbox, Input, Textarea } from '@nextui-org/react';
import { OrgansSection, GenderBalanceSection, MeasuresSection, AttachmentsSection } from 'ui';
import { submissionSchema, type SubmissionInput } from 'validation';

export default function PublicFormPage() {
  const router = useRouter();
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
    consentText: 'I consent to data processing as described.',
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
        setResult(err?.message || 'Submission failed');
      } else {
        // Redirect to success page on successful submission
        router.push('/form/success');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Anonymous Company Form</h1>
      {result && <Card className="p-3 text-sm">{result}</Card>}
      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-medium">Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Company name" value={form.name} onChange={(e) => update('name', e.target.value)} isInvalid={!!errors.name} errorMessage={errors.name?.[0]} />
            <Input label="Company code" value={form.code} onChange={(e) => update('code', e.target.value)} isInvalid={!!errors.code} errorMessage={errors.code?.[0]} />
            <Input label="Country (ISO2)" value={form.country} onChange={(e) => update('country', e.target.value)} isInvalid={!!errors.country} errorMessage={errors.country?.[0]} />
            <Input label="Legal form" value={form.legalForm} onChange={(e) => update('legalForm', e.target.value)} />
            <Input label="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
            <Input label="Registry" value={form.registry} onChange={(e) => update('registry', e.target.value)} />
            <Input label="eDelivery address" value={form.eDeliveryAddress} onChange={(e) => update('eDeliveryAddress', e.target.value)} />
            <Input type="url" label="Requirements link (optional)" value={form.requirementsLink ?? ''} onChange={(e) => update('requirementsLink', e.target.value || undefined)} />
            <Input type="date" label="Reporting from" value={form.reportingFrom} onChange={(e) => update('reportingFrom', e.target.value)} />
            <Input type="date" label="Reporting to" value={form.reportingTo} onChange={(e) => update('reportingTo', e.target.value)} />
          </div>
          <Checkbox isSelected={form.requirementsApplied} onValueChange={(v) => update('requirementsApplied', v)}>Requirements applied</Checkbox>
        </Card>

  <OrgansSection value={form.organs || []} onChange={(rows) => update('organs', rows)} />
  <GenderBalanceSection value={form.genderBalance} onChange={(rows) => update('genderBalance', rows)} />
  <MeasuresSection value={form.measures || []} onChange={(rows) => update('measures', rows)} />
  <AttachmentsSection value={form.attachments || []} onChange={(rows) => update('attachments', rows)} />

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-medium">Contact & Other</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Contact name" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} />
            <Input type="email" label="Contact email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} />
            <Input label="Contact phone" value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} />
          </div>
          <Textarea label="Reasons for underrepresentation (optional)" value={form.reasonsForUnderrepresentation ?? ''} onChange={(e) => update('reasonsForUnderrepresentation', e.target.value || undefined)} />
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-medium">Submitter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Full name" value={form.submitter.name} onChange={(e) => update('submitter', { ...form.submitter, name: e.target.value })} />
            <Input label="Title" value={form.submitter.title ?? ''} onChange={(e) => update('submitter', { ...form.submitter, title: e.target.value })} />
            <Input label="Phone" value={form.submitter.phone} onChange={(e) => update('submitter', { ...form.submitter, phone: e.target.value })} />
            <Input type="email" label="Email" value={form.submitter.email} onChange={(e) => update('submitter', { ...form.submitter, email: e.target.value })} />
          </div>
          <Checkbox isSelected={form.consent} onValueChange={(v) => update('consent', v)}>
            I agree to the processing of my data.
          </Checkbox>
        </Card>

        <div className="flex justify-end">
          <Button color="primary" type="submit" isLoading={submitting}>Submit</Button>
        </div>
      </form>
    </div>
  );
}
