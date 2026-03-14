import { COLORS } from "@/constants/COLORS";
import { ReanimatedTrueSheetProvider } from "@lodev09/react-native-true-sheet/reanimated";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../../global.css";

export default function RootLayout() {
  const isAuth = false;
  return (
    <ReanimatedTrueSheetProvider>
      <PaperProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: COLORS.primary },
          }}
        >
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
    </ReanimatedTrueSheetProvider>
  );
}
