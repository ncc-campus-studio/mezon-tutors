import { Paragraph, Text, YStack, styled, type GetProps } from 'tamagui';
import type { ReactNode } from 'react';

export const Card = styled(YStack, {
  name: 'Card',
  borderRadius: '$appCard',
  backgroundColor: '$backgroundCard',
  borderWidth: 1,
  borderColor: '$borderCard',
  padding: '$4',
  shadowColor: '$appShadow',
  shadowRadius: 25,
  shadowOffset: { width: 0, height: 8 },
  gap: '$3',
});

export const StatusCard = styled(Card, {
  name: 'StatusCard',
  borderRadius: 16,
  padding: '$5',
  gap: '$4',
  borderWidth: 2,
  variants: {
    variant: {
      success: {
        backgroundColor: '$statusSuccessBg',
        borderColor: '$statusSuccessBorder',
      },
      danger: {
        backgroundColor: '$statusErrorBg',
        borderColor: '$statusErrorBorder',
      },
      warning: {
        backgroundColor: '$statusWarningBg',
        borderColor: '$statusWarningBorder',
      },
      info: {
        backgroundColor: '$statusInfoBg',
        borderColor: '$statusInfoBorder',
      },
    },
  },
  defaultVariants: {
    variant: 'success',
  },
});

export type CardProps = GetProps<typeof Card>;
export type StatusCardProps = GetProps<typeof StatusCard>;

export type InfoCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};

export function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <YStack
      minWidth={220}
      borderRadius="$4"
      padding="$4"
      backgroundColor="$backgroundCard"
      borderWidth={1}
      borderColor="$borderSubtle"
      alignItems="center"
      gap="$2"
    >
      <YStack
        width={56}
        height={56}
        borderRadius={999}
        backgroundColor="$backgroundMuted"
        alignItems="center"
        justifyContent="center"
        marginBottom="$1"
      >
        {icon}
      </YStack>
      <Text
        color="$color8"
        textTransform="uppercase"
        letterSpacing={1}
      >
        {title}
      </Text>
      <Paragraph
        fontWeight="600"
        fontSize={20}
      >
        {value}
      </Paragraph>
    </YStack>
  );
}
