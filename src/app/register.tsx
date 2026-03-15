import { COLORS } from "@/constants/COLORS";
import AuthContext from "@/contexts/AuthContext";
import { loadUser, register } from "@/services/AuthService";
import { useContext, useRef, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    try {
      await register(
        name,
        email,
        password,
        confirmPassword,
        `${Platform.OS} ${Platform.Version}`,
      );
      const user = await loadUser();
      setUser(user);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="gap-4 px-6 pt-12">
        <Text className="text-text text-3xl font-semibold">REGISTER</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={COLORS.tint}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
          className="rounded-xl bg-secondary px-4 py-3 text-text"
        />

        <TextInput
          ref={emailInputRef}
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
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          className="rounded-xl bg-secondary px-4 py-3 text-text"
        />

        <TextInput
          ref={confirmPasswordInputRef}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
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
          onPress={handleRegister}
        >
          <Text className="text-text text-center font-semibold">REGISTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
