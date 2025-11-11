import request from 'supertest';
import { app } from '../../app';
jest.mock('db', () => ({
  createSubmissionTree: jest.fn().mockResolvedValue({ id: 'test-id' }),
  upsertCompany: jest.fn().mockResolvedValue({ id: 'company-id', isNew: false }),
}));

describe('POST /api/submissions', () => {
  it('validates body and returns 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({})
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('accepts a valid payload and returns 201', async () => {
    const valid = {
      name: 'Acme Ltd',
      code: 'ACME123',
      country: 'LT',
      companyType: 'LISTED',
      legalForm: 'UAB',
      address: 'Street 1',
      registry: 'Reg',
      eDeliveryAddress: 'edev@acme.lt',
      reportingFrom: '2025-01-01',
      reportingTo: '2025-06-30',
      contactName: 'Jane Doe',
      contactEmail: 'jane@acme.lt',
      contactPhone: '+37060000000',
      requirementsApplied: true,
      organs: [],
      genderBalance: [{ role: 'CEO', women: 0, men: 1, total: 1 }],
      measures: [],
      attachments: [],
      consent: true,
      consentText: 'I agree',
      submitter: { name: 'Jane Doe', phone: '+37060000000', email: 'jane@acme.lt' },
      captchaToken: 'token',
    };
    const res = await request(app)
      .post('/api/submissions')
      .send(valid)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });
});
