import { typography } from '../typography'
import { tokens } from '../tokens'

export const textStyles = {
  h1: {
    ...typography.h1,
    color: tokens.text.primary,
  },

  h2: {
    ...typography.h2,
    color: tokens.text.primary,
  },

  h3: {
    ...typography.h3,
    color: tokens.text.primary,
  },

  body: {
    ...typography.body,
    color: tokens.text.primary,
  },

  bodyMedium: {
    ...typography.bodyMedium,
    color: tokens.text.primary,
  },

  caption: {
    ...typography.caption,
    color: tokens.text.secondary,
  },

  small: {
    ...typography.small,
    color: tokens.text.secondary,
  },
}