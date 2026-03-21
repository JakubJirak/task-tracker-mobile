import { createFormHook } from "@tanstack/react-form";
import { AppCategorySelectorField } from "./categorySelectorField";
import { AppColorPickerField } from "./colorPickerField";
import { fieldContext, formContext } from "./formCore";
import { AppFormSubmitButton } from "./submitButton";
import { AppTextInputField } from "./textInputField";

export { useFieldContext, useFormContext } from "./formCore";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInputField: AppTextInputField,
    ColorPickerField: AppColorPickerField,
    CategorySelectorField: AppCategorySelectorField,
  },
  formComponents: {
    SubmitButton: AppFormSubmitButton,
  },
});
