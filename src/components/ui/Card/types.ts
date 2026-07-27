import { PropsWithChildren } from 'react'
import { StyleProp, ViewProps, ViewStyle } from 'react-native'

export interface CardProps
  extends PropsWithChildren,
    Omit<ViewProps, 'style'> {
  style?: StyleProp<ViewStyle>
}