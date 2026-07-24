import { TextTone, TextVariant } from '@/theme/types'
import { TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native'


export interface TextProps extends Omit<RNTextProps, 'style'> {
  style?: StyleProp<TextStyle>
  variant?: TextVariant
  tone?: TextTone
}