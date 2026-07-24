import { PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export interface ScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>
}