import { COLORS } from "@/constants/COLORS";
import { Pressable, Text, View } from "react-native";
import { getFirstFieldErrorMessage } from "./errorMessage";
import { useFieldContext } from "./formCore";

type AppColorPickerFieldProps = {
  label: string;
  buttonLabel?: string;
  onPress: () => void;
};

export function AppColorPickerField({
  label,
  buttonLabel = "Vybrat barvu",
  onPress,
}: AppColorPickerFieldProps) {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View>
      <Text className="text-text text-lg mb-1.5 font-medium">{label}</Text>
      <Pressable
        onPress={onPress}
        className="bg-secondary rounded-lg h-14 px-3.5 flex-row items-center justify-between"
      >
        <Text className="text-muted text-base">{buttonLabel}</Text>
        <View
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: field.state.value || COLORS.muted }}
        />
      </Pressable>
      {hasError ? (
        <Text className="text-red-400 text-xs mt-1">
          {getFirstFieldErrorMessage(field.state.meta.errors)}
        </Text>
      ) : null}
    </View>
  );
}
