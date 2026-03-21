import { FieldError, Input, Label, TextField } from "heroui-native";
import { TextInputProps } from "react-native";
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
    <TextField isInvalid={hasError}>
      <Label className="text-text font-medium">{label}</Label>
      <Input
        value={field.state.value}
        className="bg-secondary border-secondary rounded-lg text-base text-text"
        placeholderColorClassName="text-muted"
        selectionColorClassName="accent-accent"
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
        {...props}
      />
      {hasError ? (
        <FieldError className="text-red-400 text-xs mt-1">
          {getFirstFieldErrorMessage(field.state.meta.errors)}
        </FieldError>
      ) : null}
    </TextField>
  );
}
