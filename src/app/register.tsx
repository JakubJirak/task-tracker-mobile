import { useAppForm } from "@/components/forms/formContext";
import AuthContext from "@/contexts/AuthContext";
import { loadUser, register } from "@/services/AuthService";
import { useContext, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Jméno je povinné")
      .max(16, "Jméno může mít maximálně 16 znaků"),
    email: z.string().trim().email("Zadejte platný e-mail"),
    password: z
      .string()
      .min(12, "Heslo musí mít alespoň 12 znaků")
      .max(255, "Heslo může mít maximálně 255 znaků"),
    confirmPassword: z.string().min(1, "Potvrzení hesla je povinné"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Hesla se musí shodovat",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);

      try {
        await register(
          value.name.trim(),
          value.email.trim(),
          value.password,
          value.confirmPassword,
          `${Platform.OS} ${Platform.Version}`,
        );
        const user = await loadUser();
        setUser(user);
      } catch (error) {
        console.error("Registration failed", error);
        setAuthError("Registrace se nezdařila. Zkuste to prosím znovu.");
      }
    },
  });

  const isDisabled = ({
    name,
    email,
    password,
    confirmPassword,
  }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    return (
      !name.trim() ||
      !email.trim() ||
      password.length < 12 ||
      !confirmPassword ||
      password !== confirmPassword
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4 pt-16">
            <Text className="text-text text-3xl font-semibold text-center">
              Zaregistrovat se
            </Text>

            <form.AppForm>
              <View className="gap-4 px-4 mb-8">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextInputField
                      label="Jméno"
                      placeholder="Jméno"
                      autoCapitalize="words"
                      autoCorrect={false}
                      autoComplete="name"
                      textContentType="name"
                      returnKeyType="next"
                    />
                  )}
                />

                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextInputField
                      label="Email"
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
                    />
                  )}
                />

                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.TextInputField
                      label="Heslo"
                      placeholder="Heslo"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
                      returnKeyType="next"
                    />
                  )}
                />

                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.TextInputField
                      label="Potvrzení hesla"
                      placeholder="Potvrzení hesla"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
                      returnKeyType="done"
                    />
                  )}
                />
              </View>

              {authError ? (
                <Text className="text-danger text-sm px-4">{authError}</Text>
              ) : null}

              <form.Subscribe
                selector={(state) => ({
                  name: state.values.name,
                  email: state.values.email,
                  password: state.values.password,
                  confirmPassword: state.values.confirmPassword,
                })}
              >
                {({ name, email, password, confirmPassword }) => (
                  <form.SubmitButton
                    label="Registrovat se"
                    pendingLabel="Registruji..."
                    disabled={isDisabled({
                      name,
                      email,
                      password,
                      confirmPassword,
                    })}
                  />
                )}
              </form.Subscribe>
            </form.AppForm>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
