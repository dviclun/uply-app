import {
  Button,
  Container,
  Screen,
  Stack,
  Text,
} from '@/components/ui'

export default function HomeScreen() {
  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <Text variant="h1">Uply</Text>

          <Button>Primary</Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="danger">
            Danger
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>
        </Stack>
      </Container>
    </Screen>
  )
}