import { StyleSheet, View } from 'react-native'

import { spacing } from '@/theme'

import { ContainerProps } from './types'

export function Container({
  children,
  padding = 'md',
  style,
  ...props
}: ContainerProps) {
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing[padding],
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
    width: '100%',
  },
})