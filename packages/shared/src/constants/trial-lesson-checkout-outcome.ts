/**
 * Trial lesson checkout cancel / fail screen — URL ?code= matches these values.
 * Mapped from VNPAY vnp_ResponseCode / vnp_TransactionStatus on browser return (API redirect).
 */
export const TRIAL_LESSON_CHECKOUT_CANCEL_CODES = [
  'user_cancelled',
  'payment_declined',
  'auth_failed',
  'session_expired',
  'gateway_error',
  'invalid_signature',
  'order_not_found',
  'unknown',
] as const;

export type TrialLessonCheckoutCancelCode = (typeof TRIAL_LESSON_CHECKOUT_CANCEL_CODES)[number];

export function isTrialLessonCheckoutCancelCode(s: string): s is TrialLessonCheckoutCancelCode {
  return (TRIAL_LESSON_CHECKOUT_CANCEL_CODES as readonly string[]).includes(s);
}

/**
 * Map VNPAY response codes to a small set of UI buckets (non-success paths only).
 * Ref: VNPAY sandbox response code list (00 = success).
 */
export function mapVnpayResponseToTrialLessonCancelCode(
  responseCode: string | undefined,
  transactionStatus: string | undefined
): TrialLessonCheckoutCancelCode {
  const rc = (responseCode ?? '').trim();
  const ts = (transactionStatus ?? '').trim();

  if (rc === '24') return 'user_cancelled';

  if (rc === '11') return 'session_expired';

  if (['10', '13'].includes(rc)) return 'auth_failed';

  if (['51', '12', '65', '09', '79', '07'].includes(rc)) {
    return 'payment_declined';
  }

  if (['75', '99'].includes(rc)) return 'gateway_error';

  if (ts === '02') return 'payment_declined';

  if (rc === '00' && ts && ts !== '00') {
    return 'gateway_error';
  }

  return 'unknown';
}

export function trialLessonCheckoutCancelIsSoftTone(code: TrialLessonCheckoutCancelCode): boolean {
  return code === 'user_cancelled' || code === 'session_expired';
}

export function resolveTrialLessonCancelCodeFromSearchParams(
  searchParams: URLSearchParams | null
): TrialLessonCheckoutCancelCode {
  const raw = searchParams?.get('code')?.trim() ?? '';
  if (raw && isTrialLessonCheckoutCancelCode(raw)) {
    return raw;
  }

  const legacy = searchParams?.get('reason')?.toLowerCase().trim() ?? '';
  if (legacy === 'failed' || legacy === 'error' || legacy === 'declined') {
    return 'gateway_error';
  }

  return 'user_cancelled';
}
