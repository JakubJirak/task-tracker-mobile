import { useAppForm } from "@/components/forms/formContext";
import AuthContext from "@/contexts/AuthContext";
import { loadUser, login } from "@/services/AuthService";
import { useContext, useState } from "react";
import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Zadejte platný e-mail"),
  password: z
    .string()
    .min(12, "Heslo musí mít alespoň 12 znaků")
    .max(255, "Heslo může mít maximálně 255 znaků"),
});

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthError(null);

      try {
        await login(
          value.email.trim(),
          value.password,
          `${Platform.OS} ${Platform.Version}`,
        );
        const user = await loadUser();
        setUser(user);
      } catch (error) {
        console.error("Login failed:", error);
        setAuthError("Přihlášení se nezdařilo. Zkuste to prosím znovu.");
      }
    },
  });

  const isDisabled = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return !email.trim() || password.length < 12;
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="gap-4 pt-12">
        <Text className="text-text text-3xl font-semibold text-center">
          Přihlásit se
        </Text>

        <form.AppForm>
          <View className="gap-4 px-4 mb-8">
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
                  returnKeyType="done"
                />
              )}
            />
          </View>

          <form.Subscribe
            selector={(state) => ({
              email: state.values.email,
              password: state.values.password,
            })}
          >
            {({ email, password }) => (
              <form.SubmitButton
                label="Přihlásit se"
                pendingLabel="Přihlašuji..."
                disabled={isDisabled({ email, password })}
              />
            )}
          </form.Subscribe>

          {authError ? (
            <Text className="text-danger text-sm px-4">{authError}</Text>
          ) : null}
        </form.AppForm>
      </View>
    </SafeAreaView>
  );
}
