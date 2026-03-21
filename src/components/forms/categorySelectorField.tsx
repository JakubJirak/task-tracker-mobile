import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { Radio, RadioGroup } from "heroui-native";
import { Text, View } from "react-native";
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

  const onValueChange = (value: string) => {
    field.handleChange(value);
    field.handleBlur();
  };

  return (
    <View>
      <Text className="text-text text-lg mb-1.5 font-medium">{label}</Text>
      <RadioGroup
        value={field.state.value}
        onValueChange={onValueChange}
        className="flex-row flex-wrap justify-between gap-y-2"
      >
        {options.map((option) => {
          const isActive = field.state.value === option.value;

          return (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              className={`h-12 w-[48%] rounded-lg px-3 bg-secondary flex-row items-center justify-start gap-3 ${isActive ? "border border-accent" : "border-none"}`}
            >
              <View className="flex-row items-center gap-2">
                <Radio />
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
              </View>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup>
      {hasError ? (
        <Text className="text-red-400 text-xs mt-1">
          {getFirstFieldErrorMessage(field.state.meta.errors)}
        </Text>
      ) : null}
    </View>
  );
}
