import { radius } from '../radius'
import { shadows } from '../shadows'
import { spacing } from '../spacing'
import { tokens } from '../tokens'

export const cardStyles = {
    container: {
      backgroundColor: tokens.background.surface,

      borderWidth: 0,
      borderColor: tokens.border.default,

      borderRadius: radius.xl,

      padding: spacing.lg,
      ...shadows.sm,
    },
}