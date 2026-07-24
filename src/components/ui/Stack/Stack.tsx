import { View, StyleSheet } from 'react-native'

import { spacing } from '@/theme'

import { StackProps } from './types'

export function Stack({
  children,
  spacing: spacingSize = 'md',
  direction = 'column',
  style,
  ...props
}: StackProps) {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: direction,
          gap: spacing[spacingSize],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
})