import {
  Text as RNText,
} from 'react-native'

import { textStyles, tokens } from '@/theme'

import { TextProps } from './types'
import { TextTone } from '@/theme/types'


const toneMap: Record<TextTone, string> = {
  primary: tokens.text.primary,
  secondary: tokens.text.secondary,
  inverse: tokens.text.inverse,
  success: tokens.status.success,
  danger: tokens.status.danger,
  warning: tokens.status.warning,
}

export function Text({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        textStyles[variant],
        {
            color: toneMap[tone],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  )
}