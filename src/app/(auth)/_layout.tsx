import { COLORS } from "@/constants/COLORS";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: COLORS.primary }}
    >
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: COLORS.primary },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="proj" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
