import { router, Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Movimientos",
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();

            router.push({
              pathname: "/transactions",
              params: {
                resetFilter: "true",
              },
            });
          },
        }}
      />
    </Tabs>
  );
}
