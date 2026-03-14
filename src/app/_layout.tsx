import { COLORS } from "@/constants/COLORS";
import type { AuthUser } from "@/contexts/AuthContext";
import AuthContext from "@/contexts/AuthContext";
import { loadUser } from "@/services/AuthService";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import "../../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<AuthUser | null>(null);

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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <PaperProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: COLORS.primary },
          }}
        >
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
