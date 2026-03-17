import { COLORS } from "@/constants/COLORS";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: COLORS.primary },
        headerShown: false,
      }}
    />
  );
}
