import { Paragraph, XStack, styled, type GetProps } from 'tamagui'

export const Chip = styled(XStack, {
  name: 'Chip',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  borderRadius: '$appPill',
  borderWidth: 1,

  variants: {
    tone: {
      default: {
        backgroundColor: '$backgroundMuted',
        borderColor: '$borderSubtle',
      },
      neutral: {
        backgroundColor: '$backgroundCard',
        borderColor: '$borderSubtle',
      },
      primary: {
        backgroundColor: '$appSecondary',
        borderColor: '$appPrimary',
      },
      success: {
        backgroundColor: '$toastSuccessBg',
        borderColor: '$toastSuccessBorder',
      },
      danger: {
        backgroundColor: '$toastErrorBg',
        borderColor: '$toastErrorBorder',
      },
      info: {
        backgroundColor: '$toastInfoBg',
        borderColor: '$toastInfoBorder',
      },
    },
    variant: {
      solid: {},
      outline: {
        backgroundColor: 'transparent',
      },
    },
    size: {
      sm: {
        height: 22,
        paddingHorizontal: '$2',
      },
      md: {
        height: 26,
        paddingHorizontal: '$3',
      },
      lg: {
        height: 30,
        paddingHorizontal: '$4',
      },
    },
  } as const,

  defaultVariants: {
    tone: 'default',
    variant: 'solid',
    size: 'md',
  },
})

export const ChipText = styled(Paragraph, {
  name: 'ChipText',
  fontWeight: '600',
  letterSpacing: -0.2,
  userSelect: 'none',

  variants: {
    tone: {
      default: { color: '$appText' },
      neutral: { color: '$appText' },
      primary: { color: '$appPrimary' },
      success: { color: '$toastSuccessText' },
      danger: { color: '$toastErrorText' },
      info: { color: '$toastInfoText' },
    },
    variant: {
      solid: {},
      outline: {},
    },
    size: {
      sm: { fontSize: 11, lineHeight: 16 },
      md: { fontSize: 12, lineHeight: 18 },
      lg: { fontSize: 13, lineHeight: 20 },
    },
  } as const,

  defaultVariants: {
    tone: 'default',
    variant: 'solid',
    size: 'md',
  },
})

export type ChipProps = GetProps<typeof Chip>
export type ChipTextProps = GetProps<typeof ChipText>

