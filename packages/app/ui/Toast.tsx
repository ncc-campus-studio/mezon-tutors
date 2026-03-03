import { styled, type GetProps } from 'tamagui';
import { Toast as ToastPrimitive } from '@tamagui/toast';

export const Toast = styled(ToastPrimitive, {
  name: 'Toast',

  backgroundColor: '$background',
  borderRadius: '$appPill',
  borderWidth: 1,
  paddingHorizontal: '$3',
  paddingVertical: '$2',

  variants: {
    type: {
      success: {
        backgroundColor: '$toastSuccessBg',
        borderColor: '$toastSuccessBorder',
      },
      error: {
        backgroundColor: '$toastErrorBg',
        borderColor: '$toastErrorBorder',
      },
      info: {
        backgroundColor: '$toastInfoBg',
        borderColor: '$toastInfoBorder',
      },
    },
  },

  defaultVariants: {
    type: 'info',
  },
});

export type ToastProps = GetProps<typeof Toast>;
