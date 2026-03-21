import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { getFirstFieldErrorMessage } from "./errorMessage";
import { useFieldContext } from "./formCore";

type CategoryOption = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

type AppCategorySelectorFieldProps = {
  label: string;
  options: CategoryOption[];
};

export function AppCategorySelectorField({
  label,
  options,
}: AppCategorySelectorFieldProps) {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View>
      <Text className="text-text text-lg mb-1.5 font-medium">{label}</Text>
      <View className="flex-row flex-wrap justify-between gap-y-2">
        {options.map((option) => {
          const isActive = field.state.value === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => {
                field.handleChange(option.value);
                field.handleBlur();
              }}
              className={`h-12 w-[48%] rounded-lg px-3 flex-row items-center justify-center gap-2 border-secondary bg-secondary ${
                isActive ? "border border-accent" : "border-none"
              }`}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={isActive ? "white" : COLORS.muted}
              />
              <Text
                className={`text-base ${
                  isActive ? "text-white font-semibold" : "text-muted"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {hasError ? (
        <Text className="text-red-400 text-xs mt-1">
          {getFirstFieldErrorMessage(field.state.meta.errors)}
        </Text>
      ) : null}
    </View>
  );
}
