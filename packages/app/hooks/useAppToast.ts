import { useToastController } from '@mezon-tutors/app/ui';

/**
 * useAppToast is a standardized wrapper around the UI toast system.
 * It provides simplified methods for common success and error notifications.
 */
export function useAppToast() {
  const toast = useToastController();

  return {
    show: (title: string, message?: string) => {
      toast.show(title, { message });
    },

    success: (title: string, message?: string) => {
      toast.show(title, {
        message,
        type: 'success',
      });
    },

    error: (title: string, message?: string) => {
      toast.show(title, {
        message,
        type: 'error',
      });
    },

    info: (title: string, message?: string) => {
      toast.show(title, {
        message,
        type: 'info',
      });
    },

    hide: () => {
      toast.hide();
    },
  };
}
