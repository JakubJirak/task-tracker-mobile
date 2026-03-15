import { COLORS } from "@/constants/COLORS";
import AuthContext from "@/contexts/AuthContext";
import { loadUser, login } from "@/services/AuthService";
import { useContext, useRef, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      await login(email, password, `${Platform.OS} ${Platform.Version}`);
      const user = await loadUser();
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="gap-4 px-6 pt-12">
        <Text className="text-text text-3xl font-semibold">LOGIN</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={COLORS.tint}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          className="rounded-xl bg-secondary px-4 py-3 text-text"
        />

        <TextInput
          ref={passwordInputRef}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={COLORS.tint}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          className="rounded-xl bg-secondary px-4 py-3 text-text"
        />

        <TouchableOpacity
          className="bg-accent py-3 rounded-xl"
          onPress={handleLogin}
        >
          <Text className="text-text text-center font-semibold">LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
