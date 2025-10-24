import { SimpleCaptchaVerifier, NoopCaptchaVerifier } from '../captcha';

describe('CaptchaVerifier', () => {
  describe('NoopCaptchaVerifier', () => {
    it('should always return success', async () => {
      const verifier = new NoopCaptchaVerifier();
      const result = await verifier.verify('any-token');
      expect(result.success).toBe(true);
    });
  });

  describe('SimpleCaptchaVerifier', () => {
    it('should succeed with correct token', async () => {
      const verifier = new SimpleCaptchaVerifier('secret-token');
      const result = await verifier.verify('secret-token');
      expect(result.success).toBe(true);
    });

    it('should fail with incorrect token', async () => {
      const verifier = new SimpleCaptchaVerifier('secret-token');
      const result = await verifier.verify('wrong-token');
      expect(result.success).toBe(false);
      expect(result.reason).toContain('CAPTCHA verification failed');
    });

    it('should handle service unavailability', async () => {
      const verifier = new SimpleCaptchaVerifier('secret-token', true);
      const result = await verifier.verify('secret-token');
      expect(result.success).toBe(false);
      expect(result.reason).toContain('temporarily unavailable');
    });
  });
});
