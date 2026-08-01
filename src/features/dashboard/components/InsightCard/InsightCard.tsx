import { Card, Stack, Text } from "@/components/ui";
import { useDashboard } from "@/hooks";

export function InsightCard() {
  const { data: dashboard } = useDashboard();

  if (!dashboard) {
    return null;
  }

  return (
    <Card>
      <Stack spacing="md">
        <Text variant="bodyMedium">{dashboard.insight.title}</Text>

        <Text tone="secondary">{dashboard.insight.message}</Text>
      </Stack>
    </Card>
  );
}
