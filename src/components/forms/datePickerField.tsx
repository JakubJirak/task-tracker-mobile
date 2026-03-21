import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { cs } from "date-fns/locale/cs";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { getFirstFieldErrorMessage } from "./errorMessage";
import { useFieldContext } from "./formCore";

type AppDatePickerFieldProps = {
  label: string;
  placeholder?: string;
};

export function AppDatePickerField({
  label,
  placeholder = "Vybrat datum",
}: AppDatePickerFieldProps) {
  const field = useFieldContext<Date | null>();
  const [showPicker, setShowPicker] = useState(false);

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const presentPicker = () => {
    setShowPicker(true);
  };

  const onDateChange = (_: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      field.handleChange(selectedDate);
      field.handleBlur();
    }

    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }
  };

  const selectedDateLabel = field.state.value
    ? format(field.state.value, "d. MMMM yyyy", { locale: cs })
    : placeholder;

  return (
    <>
      <View>
        <Text className="text-text text-lg mb-1.5 font-medium">{label}</Text>
        <Pressable
          onPress={presentPicker}
          className="bg-secondary rounded-lg h-11 px-3 flex-row items-center justify-between"
        >
          <Text className="text-text text-base">{selectedDateLabel}</Text>
        </Pressable>
        {hasError ? (
          <Text className="text-red-400 text-xs mt-1">
            {getFirstFieldErrorMessage(field.state.meta.errors)}
          </Text>
        ) : null}
      </View>

      {showPicker ? (
        <DateTimePicker
          value={field.state.value ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      ) : null}
    </>
  );
}
