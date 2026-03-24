import { Text, TouchableOpacity } from "react-native";
import { useFormContext } from "./formCore";

type AppFormSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  disabled?: boolean;
};

export function AppFormSubmitButton({
  label,
  pendingLabel,
  disabled = false,
}: AppFormSubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => {
        const isDisabled = disabled || !canSubmit || isSubmitting;

        return (
          <TouchableOpacity
            onPress={form.handleSubmit}
            disabled={isDisabled}
            className={`py-3 mx-4 rounded-xl mb-6 bg-accent ${isDisabled ? "bg-accent-900" : ""}`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-white text-lg text-center font-semibold ${isDisabled ? "text-muted" : ""}`}
            >
              {isSubmitting ? (pendingLabel ?? label) : label}
            </Text>
          </TouchableOpacity>
        );
      }}
    </form.Subscribe>
  );
}
