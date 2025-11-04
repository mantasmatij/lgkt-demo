import { NextResponse } from 'next/server';
import { makeCompanyFormSchema } from '../../../lib/validation/companyForm';
import { dictionaries } from '../../../i18n/dictionaries';
import { mapToSubmissionPayload } from '../../../lib/mappers/companyFormMapper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Default to Lithuanian messages on the server; client-side prevents most errors before submit
    const tv = (dictionaries.lt as typeof dictionaries['lt']).validation as Record<string, string>;
    const schema = makeCompanyFormSchema({
      required: tv['required'],
      email: tv['invalid_email'],
      url: tv['invalid_url'],
      invalidDate: tv['invalid_date'],
      dateMin: tv['date_min'],
      dateOrder: tv['date_order'],
      consentRequired: tv['consent_required'],
      genderTotalMismatch: tv['gender_total_mismatch'],
      phoneMin: tv['phone_min'],
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = mapToSubmissionPayload(parsed.data);
    // For now, do not forward to backend API. This route serves as validation/mapping boundary.
    // A future enhancement can forward `payload` to the Express API or persist as needed.
    return NextResponse.json({ ok: true, payloadShape: Object.keys(payload) }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ code: 'SERVER_ERROR', message: (err as Error)?.message || 'Unexpected error' }, { status: 500 });
  }
}
