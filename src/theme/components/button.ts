import { ViewStyle } from 'react-native'

import { radius } from '../radius'
import { spacing } from '../spacing'
import { tokens } from '../tokens'
import { ButtonVariant, TextTone, TextVariant } from '../types'

interface ButtonTextStyle {
  variant: TextVariant
}

interface ButtonVariantTextStyle {
  tone: TextTone
}

interface ButtonContainerStyle extends ViewStyle {}

interface ButtonVariantStyle {
  container: ButtonContainerStyle
  text: ButtonVariantTextStyle
}

export const buttonStyles: {
  base: {
    container: ButtonContainerStyle
    text: ButtonTextStyle
  }
  primary: ButtonVariantStyle
  secondary: ButtonVariantStyle
  danger: ButtonVariantStyle
  ghost: ButtonVariantStyle
} = {
  base: {
    container: {
      alignItems: 'center',
      justifyContent: 'center',

      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,

      borderRadius: radius.md,

      minHeight: 48,
    },

    text: {
      variant: 'bodyMedium',
    },
  },

  primary: {
    container: {
      backgroundColor: tokens.brand.primary,
      borderWidth: 0,
      borderColor: 'transparent',
    },

    text: {
      tone: 'inverse',
    },
  },

  secondary: {
    container: {
      backgroundColor: tokens.background.secondary,
      borderWidth: 1,
      borderColor: tokens.border.default,
    },

    text: {
      tone: 'primary',
    },
  },

  danger: {
    container: {
      backgroundColor: tokens.status.danger,
      borderWidth: 0,
      borderColor: 'transparent',
    },

    text: {
      tone: 'inverse',
    },
  },

  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
    },

    text: {
      tone: 'primary',
    },
  },
}