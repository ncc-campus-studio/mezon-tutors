import { Paragraph, styled, type GetProps } from 'tamagui';

export const Text = styled(Paragraph, {
  name: 'Text',
  color: '$appText',
  fontSize: 14,
  lineHeight: 20,
  variants: {
    variant: {
      muted: {
        color: '$color10',
      },
      primary: {
        color: '$appPrimary',
      },
    },
    size: {
      sm: { fontSize: 12, lineHeight: 18 },
      md: { fontSize: 14, lineHeight: 20 },
      lg: { fontSize: 16, lineHeight: 24 },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
});

export type TextProps = GetProps<typeof Text>;

