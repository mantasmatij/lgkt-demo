export interface CaptchaVerificationResult {
  success: boolean;
  score?: number;
  reason?: string;
}

export interface CaptchaVerifier {
  verify(token: string, ip?: string | null): Promise<CaptchaVerificationResult>;
}

// No-op verifier for development; replace with real provider (e.g., Cloudflare Turnstile / reCAPTCHA)
export class NoopCaptchaVerifier implements CaptchaVerifier {
  async verify(_token: string): Promise<CaptchaVerificationResult> {
    // reference param to satisfy no-unused-vars without changing interface
    void _token;
    return { success: true };
  }
}

export function getCaptchaVerifier(): CaptchaVerifier {
  // TODO: switch based on env configuration when provider is wired
  return new NoopCaptchaVerifier();
}
