import { Card } from '@heroui/react';
import { COMPANY_TYPE_LABEL_KEYS } from '../../lib/constants/companyType';
import type { dictionaries } from '../../i18n/dictionaries';
import type { fetchFormById } from '../../services/forms/api';

type Dict = typeof dictionaries extends Record<string, infer T> ? T : never;

type FormData = NonNullable<Awaited<ReturnType<typeof fetchFormById>>>;

export function FormDetailsView({ data, dict }: { data: FormData; dict: Dict }) {
  const tf = (k: keyof typeof dict.fields) => dict.fields[k];
  const tc = (k: keyof typeof dict.common) => dict.common[k];
  const tform = (k: keyof typeof dict.form) => dict.form[k];
  const tadmin = (k: keyof typeof dict.admin) => dict.admin[k];

  const f = data.fields as Record<string, unknown> & {
    company?: { code?: string; name?: string; country?: string; legalForm?: string; address?: string; registry?: string; eDeliveryAddress?: string };
    reportingPeriod?: { from?: string; to?: string };
    consent?: { consent?: boolean; consentText?: string };
    requirements?: { applied?: boolean; link?: string | null };
    notes?: string | null;
    totals?: { women?: number; men?: number };
    genderBalance?: Array<{ role: string; women: number; men: number; total: number }>;
    organs?: Array<{ organType: string; lastElectionDate?: string | Date | null; plannedElectionDate?: string | Date | null }>;
    measures?: Array<{ name: string; plannedResult?: string | null; indicator?: string | null; indicatorValue?: string | null; indicatorUnit?: string | null; year?: string | null }>;
    attachments?: Array<{ id: string; type: string; url?: string | null; fileName?: string | null; fileSize?: number | null }>;
    meta?: { reasonsForUnderrepresentation?: string | null; submitterName?: string | null; submitterTitle?: string | null; submitterPhone?: string | null; submitterEmail?: string | null } | null;
  };

  const fmtDate = (v: unknown) => {
    if (!v) return '';
    try {
      if (typeof v === 'string') return v.slice(0, 10);
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      const d = new Date(String(v));
      return isNaN(+d) ? '' : d.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  };
  const val = (v: unknown) => (v == null || v === '' ? '—' : String(v));

  const genderByRole = new Map<string, { women: number; men: number; total: number }>();
  (f.genderBalance || []).forEach((r) => genderByRole.set(r.role, { women: r.women, men: r.men, total: r.total }));

  const attUrl = (att: { id: string; type: string; url?: string | null }) =>
    att.type === 'LINK' && att.url ? att.url : `/api/admin/forms/${encodeURIComponent(data.id)}/attachments/${encodeURIComponent(att.id)}`;

  // Styled read-only fields (match submission details look)
  const ReadonlyField = ({ label, value, labelClassName }: { label: string; value: string; labelClassName?: string }) => (
    <div className="flex flex-col">
      <label className={"text-black mb-1 " + (labelClassName ?? 'font-normal')}>{label}</label>
      <div className="h-11 min-h-11 rounded-full border-2 border-black px-4 flex items-center whitespace-pre-wrap break-words">{value}</div>
    </div>
  );
  const ReadonlyMultiline = ({ label, value, labelClassName }: { label: string; value: string; labelClassName?: string }) => (
    <div className="flex flex-col">
      <label className={"text-black mb-1 " + (labelClassName ?? 'font-normal')}>{label}</label>
      <div className="rounded-2xl border-2 border-black px-4 py-3 whitespace-pre-wrap break-words">{value}</div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-3xl px-0">
      <div className="flex flex-col gap-3">
        {/* Company */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <ReadonlyField label={`1.1 ${tf('company_name')}`} value={val(f.company?.name)} labelClassName="font-bold" />
              <ReadonlyField label={`1.2 ${tf('company_code')}`} value={val(f.company?.code)} labelClassName="font-bold" />
              <ReadonlyField
                label={`1.3 ${tf('company_type')}`}
                value={(() => {
                  const key = COMPANY_TYPE_LABEL_KEYS[(data.companyType as keyof typeof COMPANY_TYPE_LABEL_KEYS) || 'LISTED'] as keyof typeof dict.fields;
                  const display = dict.fields[key];
                  return val(display);
                })()}
                labelClassName="font-bold"
              />
              <ReadonlyField label={`2. ${tf('legal_form')}`} value={val(f.company?.legalForm)} labelClassName="font-bold" />
              <ReadonlyField label={`3. ${tf('address')}`} value={val(f.company?.address)} labelClassName="font-bold" />
              <ReadonlyField label={`4. ${tf('registry')}`} value={val(f.company?.registry)} labelClassName="font-bold" />
              <ReadonlyField label={`5. ${tf('e_delivery_address')}`} value={val(f.company?.eDeliveryAddress)} labelClassName="font-bold" />
            </div>

            <div className="font-bold">{`6. ${tform('reporting_period_heading')}`}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ReadonlyField label={tf('reporting_from')} value={val(f.reportingPeriod?.from || data.reportPeriodFrom)} />
              <ReadonlyField label={tf('reporting_to')} value={val(f.reportingPeriod?.to || data.reportPeriodTo)} />
            </div>
          </div>
        </Card>

        {/* Organs */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">{`7. ${tform('section_organs')}`}</h3>
            {(f.organs || []).map((o, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex flex-col gap-2">
                  <ReadonlyField label={tf('organ_type')} value={o.organType === 'STEBETOJU_TARYBA' ? tf('organ_option_stebetoju_taryba') : tf('organ_option_valdyba')} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ReadonlyField label={tf('last_election_date')} value={val(fmtDate(o.lastElectionDate))} />
                    <ReadonlyField label={tf('planned_election_date')} value={val(fmtDate(o.plannedElectionDate))} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Gender balance */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">{`8. ${tform('section_gender')}`}</h3>
            {(['CEO','BOARD','SUPERVISORY_BOARD'] as const).map((role) => {
              const row = genderByRole.get(role) || { women: 0, men: 0, total: 0 };
              const roleLabel = role === 'CEO' ? tf('role_ceo') : role === 'BOARD' ? tf('role_board') : tf('role_supervisory_board');
              return (
                <div key={role} className="flex flex-col gap-2 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="text-md font-normal">{roleLabel}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ReadonlyField label={tf('women')} value={String(row.women)} />
                    <ReadonlyField label={tf('men')} value={String(row.men)} />
                    <ReadonlyField label={tf('total')} value={String(row.total)} />
                  </div>
                </div>
              );
            })}
            <Card className="p-4">
              <div className="flex flex-col gap-2">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="h-full absolute left-0 top-0" style={{ width: `${data.womenPercent}%`, backgroundColor: '#F1BA3C' }} />
                  <div className="h-full absolute right-0 top-0" style={{ width: `${data.menPercent}%`, backgroundColor: '#4D5C71' }} />
                </div>
                <p className="text-sm">
                  {tf('women')}: {(f.totals?.women ?? 0)} ({data.womenPercent}%) — {tf('men')}: {(f.totals?.men ?? 0)} ({data.menPercent}%)
                </p>
              </div>
            </Card>
          </div>
        </Card>

        {/* Measures */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">{`11. ${tform('section_measures')}`}</h3>
            {(f.measures || []).length === 0 && <div className="text-sm text-default-500">{dict.fields.no_measures}</div>}
            {(f.measures || []).map((m, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex flex-col gap-3">
                  <ReadonlyMultiline label={tf('measure_name')} value={val(m.name)} />
                  <ReadonlyMultiline label={tf('planned_result')} value={val(m.plannedResult)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ReadonlyField label={tf('planned_indicator')} value={val(m.indicator)} />
                    <ReadonlyField label={tf('indicator_value')} value={val(m.indicatorValue)} />
                    <ReadonlyField label={tf('indicator_unit')} value={val(m.indicatorUnit)} />
                    <ReadonlyField label={tf('year')} value={val(m.year)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* 12. Reasons */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <ReadonlyMultiline label={`12. ${dict.form.reasons_required}`} value={val(f.meta?.reasonsForUnderrepresentation ?? f.notes)} labelClassName="font-bold" />
          </div>
        </Card>

        {/* Attachments */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">{`10. ${tform('attachments_title')}`}</h3>
            {(f.attachments?.length ?? 0) === 0 && <div className="text-base text-default-500">{tadmin('no_attachments')}</div>}
            {f.attachments && f.attachments.length > 0 && (
              <ul className="list-none p-0 space-y-2">
                {f.attachments.map((a) => (
                  <li key={a.id} className="text-base flex items-center gap-2">
                    <a
                      href={attUrl(a)}
                      target={a.type === 'LINK' ? '_blank' : undefined}
                      rel={a.type === 'LINK' ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 underline text-gray-700 hover:text-gray-900"
                    >
                      {a.type === 'LINK' ? (
                        <svg aria-hidden="true" className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 4" />
                          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L14 20" />
                        </svg>
                      ) : (
                        <svg aria-hidden="true" className="size-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                        </svg>
                      )}
                      <span className="font-semibold">{a.type === 'LINK' ? (a.url || 'Link') : (a.fileName || 'File')}</span>
                    </a>
                    {a.fileSize ? <span className="text-gray-500">({Math.round((a.fileSize || 0) / 1024)} KB)</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Consent */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-md">{dict.form.consent_label}</span>
            <span className="text-sm">{f.consent?.consent ? tc('yes') : tc('no')}</span>
          </div>
        </Card>

        {/* Submitter */}
        <Card className="p-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">{dict.form.section_submitter}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ReadonlyField label={tf('submitter_full_name')} value={val(f.meta?.submitterName)} />
              <ReadonlyField label={tf('submitter_title')} value={val(f.meta?.submitterTitle)} />
              <ReadonlyField label={tf('submitter_phone')} value={val(f.meta?.submitterPhone)} />
              <ReadonlyField label={tf('submitter_email')} value={val(f.meta?.submitterEmail ?? data.submitterEmail)} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
