import { YStack, styled, type GetProps } from 'tamagui';

export const Card = styled(YStack, {
  name: 'Card',
  borderRadius: '$appCard',
  backgroundColor: '$backgroundCard',
  borderWidth: 1,
  borderColor: '$backgroundCard',
  padding: '$4',
  shadowColor: '$appShadow',
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  gap: '$3',
});

export type CardProps = GetProps<typeof Card>;
