import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Settings", headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        options={{ title: "Notifications", headerShown: true }}
      />
      <Stack.Screen
        name="appearance"
        options={{ title: "Appearance", headerShown: true }}
      />
    </Stack>
  );
}
