import { COLORS } from "@/constants/COLORS";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { getFirstFieldErrorMessage } from "./errorMessage";
import { useFieldContext } from "./formCore";

type AppTextInputFieldProps = {
  label: string;
} & TextInputProps;

export function AppTextInputField({ label, ...props }: AppTextInputFieldProps) {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View>
      <Text className="text-text text-lg mb-1.5 font-medium">{label}</Text>
      <TextInput
        value={field.state.value}
        className="bg-secondary rounded-lg text-base h-11 px-3 text-text"
        cursorColor={COLORS.text}
        placeholderTextColor={COLORS.muted}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
        {...props}
      />
      {hasError ? (
        <Text className="text-red-400 text-xs mt-1">
          {getFirstFieldErrorMessage(field.state.meta.errors)}
        </Text>
      ) : null}
    </View>
  );
}
