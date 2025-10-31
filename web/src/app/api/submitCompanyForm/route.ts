import { NextResponse } from 'next/server';
import { companyFormSchema } from '../../../lib/validation/companyForm';
import { mapToSubmissionPayload } from '../../../lib/mappers/companyFormMapper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = companyFormSchema.safeParse(body);
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
