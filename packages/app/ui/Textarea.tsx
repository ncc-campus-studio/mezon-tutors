import { TextArea, styled, type GetProps } from 'tamagui';

export const Textarea = styled(TextArea, {
  name: 'Textarea',
  backgroundColor: '$backgroundMuted',
  color: '$color',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: 12,
  fontSize: 14,
  lineHeight: 20,
  minHeight: 96,
});

export type TextareaProps = GetProps<typeof Textarea>;
