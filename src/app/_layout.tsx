import { client } from "@/client/client.gen";
import { COLORS } from "@/constants/COLORS";
import type { AuthUser } from "@/contexts/AuthContext";
import AuthContext from "@/contexts/AuthContext";
import { loadUser } from "@/services/AuthService";
import axiosClient from "@/utils/axios";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeConfig } from "heroui-native";
import { HeroUINativeProvider } from "heroui-native/provider";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "../../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const config: HeroUINativeConfig = {
    devInfo: {
      // Disable styling principles information message
      stylingPrinciples: false,
    },
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    checkAuth();
  }, []);

  client.setConfig({
    axios: axiosClient,
  });

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.primary,
    },
  };

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={config}>
        <ThemeProvider value={MyTheme}>
          <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ user, setUser }}>
              <PaperProvider>
                <Stack
                  screenOptions={{
                    contentStyle: { backgroundColor: COLORS.primary },
                  }}
                >
                  <Stack.Protected guard={!!user}>
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                  </Stack.Protected>

                  <Stack.Protected guard={!user}>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="register"
                      options={{ headerShown: false }}
                    />
                  </Stack.Protected>
                </Stack>
              </PaperProvider>
            </AuthContext.Provider>
          </QueryClientProvider>
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
