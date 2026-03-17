import { Button as BaseButton, styled } from 'tamagui'

/**
 * Button is the standard button component for the entire app.
 * It enforces a pill shape, standard height, and removes hover opacity on web.
 */
export const AppButton = styled(BaseButton, {
  name: 'Button',
  borderRadius: 20,
  height: 48,
  borderWidth: 1,
  borderColor: 'transparent',

  // Customizing default button look
  fontWeight: '700',
  fontSize: 14,
  letterSpacing: -0.32,

  // Hover and Press states
  pressStyle: {
    opacity: 0.8,
  },

  // Explicitly remove hover effect on web
  hoverStyle: {
    backgroundColor: 'unset',
    borderColor: 'unset',
    opacity: 1,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$appPrimary',
        color: 'white',
        borderColor: '$appPrimary',
        hoverStyle: {
          backgroundColor: '$appPrimaryHover',
          borderColor: '$appPrimaryHover',
        },
      },
      secondary: {
        backgroundColor: '$secondary',
        color: '$default',
        borderColor: '$secondary',
        hoverStyle: {
          backgroundColor: '$secondaryHover',
          borderColor: '$secondaryHover',
        },
      },
      outline: {
        backgroundColor: '$appSecondary',
        color: '$appPrimary',
        borderColor: '$appPrimary',
        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: '$appPrimary',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$color',
        borderColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$appSecondary',
          borderColor: 'transparent',
        },
      },
      tertiary: {
        backgroundColor: '$tertiary',
        color: '$color',
        hoverStyle: {
          backgroundColor: '$tertiaryHover',
          borderColor: 'transparent',
        },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'ghost',
  },
})
