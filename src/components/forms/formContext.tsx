import { createFormHook } from "@tanstack/react-form";
import { AppCategorySelectorField } from "./categorySelectorField";
import { AppColorPickerField } from "./colorPickerField";
import { AppDatePickerField } from "./datePickerField";
import { fieldContext, formContext } from "./formCore";
import { AppFormSubmitButton } from "./submitButton";
import { AppTagSelectorField } from "./tagSelectorField";
import { AppTextInputField } from "./textInputField";

export { useFieldContext, useFormContext } from "./formCore";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInputField: AppTextInputField,
    ColorPickerField: AppColorPickerField,
    CategorySelectorField: AppCategorySelectorField,
    DatePickerField: AppDatePickerField,
    TagSelectorField: AppTagSelectorField,
  },
  formComponents: {
    SubmitButton: AppFormSubmitButton,
  },
});
