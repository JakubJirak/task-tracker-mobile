import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  const isAuth = true;
  return (
    <Stack>
      <Stack.Protected guard={isAuth}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuth}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
