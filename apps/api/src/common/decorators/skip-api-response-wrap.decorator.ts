import { SetMetadata } from '@nestjs/common';

export const SKIP_API_RESPONSE_WRAP_KEY = 'skipApiResponseWrap';

export function SkipApiResponseWrap() {
  return SetMetadata(SKIP_API_RESPONSE_WRAP_KEY, true);
}
