import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { useAppFonts } from '@/hooks/useFonts'

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts()

  if (!fontsLoaded) {
    return null
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}