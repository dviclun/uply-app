import { View, Text } from 'react-native'

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: '700',
        }}
      >
        Uply
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: '#6B7280',
        }}
      >
        Your money. Upgraded.
      </Text>
    </View>
  )
}