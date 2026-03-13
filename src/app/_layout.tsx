import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../../global.css";

export default function RootLayout() {
  const isAuth = true;
  return (
    <PaperProvider>
      <Stack>
        <Stack.Protected guard={isAuth}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuth}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  );
}
