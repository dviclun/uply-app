import { View } from 'react-native'

import { cardStyles } from '@/theme/components/card'

import { CardProps } from './types'

export function Card({
  children,
  style,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        cardStyles.container,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}