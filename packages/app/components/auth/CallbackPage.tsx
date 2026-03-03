'use client';

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authService } from '@mezon-tutors/app/services/auth/auth.service';
import { MezonAuthMessage } from '@mezon-tutors/shared/src/types/auth';

const OAUTH_CHANNEL = 'mezon-oauth-result';

function sendResult(payload: MezonAuthMessage) {
  try {
    const channel = new BroadcastChannel(OAUTH_CHANNEL);
    channel.postMessage(payload);
    channel.close();
  } catch (e) {
    console.error('[OAUTH callback] BroadcastChannel failed', e);
  }
}

export default function MezonAuthCallbackPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state') ?? undefined;

    if (!code) {
      setError('Missing authorization code from Mezon.');
      return;
    }

    const codeValue = code;
    const stateValue = searchParams.get('state') ?? undefined;

    async function exchangeCode() {
      try {
        const { user, tokens } = await authService.exchangeCode(codeValue, stateValue);

        const payload = {
          type: 'MEZON_AUTH_SUCCESS' as const,
          data: { user, tokens },
        };

        sendResult(payload);
        window.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error during login.';
        setError(message);
        console.error('[OAUTH callback] exchange error', err);

        sendResult({
          type: 'MEZON_AUTH_ERROR',
          error: message,
        });
        setTimeout(() => window.close(), 500);
      }
    }

    void exchangeCode();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="rounded-lg border border-zinc-200 px-6 py-4 shadow-sm">
        <h1 className="mb-2 text-lg font-semibold text-zinc-900">Completing login with Mezon...</h1>
        {error ? (
          <p className="text-sm text-red-600">{error} You can close this window.</p>
        ) : (
          <p className="text-sm text-zinc-600">Please wait while we finish signing you in.</p>
        )}
      </div>
    </main>
  );
}
