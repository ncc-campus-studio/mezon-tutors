import { useState, useCallback } from 'react';
import { useAppToast } from './useAppToast';

interface AsyncActionOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
  errorTitle?: string;
  successMessage?: string;
  successTitle?: string;
}

/**
 * useAsyncAction is a hook to handle asynchronous operations with standard
 * loading state and automatic error reporting via toasts.
 */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options?: AsyncActionOptions<TResult>
) {
  const [isPending, setIsPending] = useState(false);
  const { error: showError, success: showSuccess } = useAppToast();

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsPending(true);
      try {
        const result = await action(...args);

        if (options?.successTitle || options?.successMessage) {
          showSuccess(
            options.successTitle || 'Success',
            options.successMessage || 'Action completed successfully'
          );
        }

        options?.onSuccess?.(result);
        return result;
      } catch (err: unknown) {
        if (options?.onError) {
          options.onError(err);
        } else {
          const message =
            (err as { body?: { message?: string } })?.body?.message ||
            (err as Error)?.message ||
            'Something went wrong';
          showError(options?.errorTitle || 'Error', message);
        }
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [action, options, showError, showSuccess]
  );

  return { execute, isPending };
}
