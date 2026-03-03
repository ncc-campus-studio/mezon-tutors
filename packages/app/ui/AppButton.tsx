import { Button as BaseButton, styled } from 'tamagui';

/**
 * Button is the standard button component for the entire app.
 * It enforces a pill shape, standard height, and removes hover opacity on web.
 */
export const AppButton = styled(BaseButton, {
  name: 'Button',
  borderRadius: '$appPill',
  height: 48,
  borderWidth: 1,
  borderColor: 'transparent',

  // Customizing default button look
  fontWeight: '500',
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
        backgroundColor: '$appSecondary',
        color: '$appText',
        borderColor: '$appSecondary',
        hoverStyle: {
          backgroundColor: '$appSecondary',
          borderColor: '$appSecondary',
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
        color: '$appText',
        borderColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$appSecondary',
          borderColor: 'transparent',
        },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'ghost',
  },
});
