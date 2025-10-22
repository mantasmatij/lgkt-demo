export interface CaptchaVerificationResult {
  success: boolean;
  score?: number;
  reason?: string;
}

export interface CaptchaVerifier {
  verify(token: string, ip?: string | null): Promise<CaptchaVerificationResult>;
}

// No-op verifier for development; always succeeds
export class NoopCaptchaVerifier implements CaptchaVerifier {
  async verify(_token: string): Promise<CaptchaVerificationResult> {
    void _token;
    return { success: true };
  }
}

// Simple CAPTCHA verifier that requires a hardcoded token for dev
// In production, replace with Cloudflare Turnstile, reCAPTCHA, or similar
export class SimpleCaptchaVerifier implements CaptchaVerifier {
  private readonly expectedToken: string;
  private readonly unavailable: boolean;

  constructor(expectedToken = 'dev-captcha-token', unavailable = false) {
    this.expectedToken = expectedToken;
    this.unavailable = unavailable;
  }

  async verify(token: string): Promise<CaptchaVerificationResult> {
    // Simulate service unavailability for testing
    if (this.unavailable) {
      return {
        success: false,
        reason: 'CAPTCHA verification service temporarily unavailable. Please try again later.',
      };
    }

    if (token === this.expectedToken) {
      return { success: true };
    }

    return {
      success: false,
      reason: 'CAPTCHA verification failed. Please complete the CAPTCHA challenge.',
    };
  }
}

export function getCaptchaVerifier(): CaptchaVerifier {
  const mode = process.env.CAPTCHA_MODE || 'noop';
  const unavailable = process.env.CAPTCHA_UNAVAILABLE === 'true';

  switch (mode) {
    case 'simple':
      return new SimpleCaptchaVerifier(
        process.env.CAPTCHA_TOKEN || 'dev-captcha-token',
        unavailable
      );
    case 'noop':
    default:
      return new NoopCaptchaVerifier();
  }
}

