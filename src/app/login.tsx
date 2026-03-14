import { COLORS } from "@/constants/COLORS";
import axios from "axios";
import { useRef, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<TextInput>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      console.log("Logging in with:", { email, password });
      const data = await axios.post(
        "http://192.168.1.25:8000/api/mobile/login",
        {
          email,
          password,
          device_name: `${Platform.OS} ${Platform.Version}`,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("Login successful:", data.data);
      setToken(data.data.token);
    } catch (error) {
      console.error("Error logging in:", error);
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
