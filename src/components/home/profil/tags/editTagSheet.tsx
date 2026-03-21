import {
  tagsIndexQueryKey,
  tagsUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { TagResource } from "@/client/types.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";
import { z } from "zod";
import ColorPicker from "./colorPicker";

type TagCategory = "project" | "task" | "reminder" | "school";

type TagPreview = Pick<TagResource, "id" | "name" | "color" | "tags_type">;

const toTagCategory = (value?: string): TagCategory => {
  if (value === "task" || value === "reminder" || value === "school") {
    return value;
  }
  return "project";
};

const editTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Název tagu je povinný")
    .max(20, "Název tagu musí mít maximálně 20 znaků"),
  color: z.string().min(1, "Barva tagu je povinná"),
});

export type EditTagSheetHandle = {
  present: (tag: TagPreview) => Promise<void>;
  dismiss: () => Promise<void>;
};

const EditTagSheet = forwardRef<EditTagSheetHandle, {}>((_, ref) => {
  const sheet = useRef<TrueSheet>(null);
  const activeTagRef = useRef<TagPreview | null>(null);
  const queryClient = useQueryClient();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerValue, setColorPickerValue] = useState<string>(
    COLORS.muted,
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      color: COLORS.muted as string,
    },
    validators: {
      onChange: editTagSchema,
    },
    onSubmit: ({ value }) => {
      if (!activeTagRef.current) return;

      editTagMut.mutate({
        path: { tag: activeTagRef.current.id },
        body: {
          name: value.name.trim(),
          color: value.color,
          tags_type: toTagCategory(activeTagRef.current.tags_type),
        },
      });
    },
  });

  const editTagMut = useMutation({
    ...tagsUpdateMutation(),
    onSuccess: () => {
      form.reset();
      sheet.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: tagsIndexQueryKey() });
    },
  });

  const hydrateFromTag = (tag: TagPreview) => {
    activeTagRef.current = tag;
    form.reset();
    form.setFieldValue("name", tag.name);
    form.setFieldValue("color", tag.color);
    setColorPickerValue(tag.color);
  };

  useImperativeHandle(ref, () => ({
    present: async (tag) => {
      hydrateFromTag(tag);
      await sheet.current?.present();
    },
    dismiss: async () => {
      setShowColorPicker(false);
      form.reset();
      await sheet.current?.dismiss();
    },
  }));

  return (
    <>
      <TrueSheet
        name="editTag"
        ref={sheet}
        detents={[0.7]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
        footer={() => (
          <form.AppForm>
            <form.Subscribe selector={(state) => state.values}>
              {(values) => {
                const trimmedName = values.name.trim();
                const currentTag = activeTagRef.current;
                const nameUnchanged = currentTag
                  ? trimmedName === currentTag.name.trim()
                  : true;
                const colorUnchanged = currentTag
                  ? values.color.toLowerCase() ===
                    currentTag.color.toLowerCase()
                  : true;
                const isSaveDisabled =
                  !trimmedName ||
                  !values.color.trim() ||
                  (nameUnchanged && colorUnchanged) ||
                  editTagMut.isPending;

                return (
                  <form.SubmitButton
                    label="Uložit"
                    pendingLabel="Ukládám..."
                    disabled={isSaveDisabled}
                  />
                );
              }}
            </form.Subscribe>
          </form.AppForm>
        )}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <Ionicons name="pencil" size={24} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">Upravit tag</Text>
          </View>

          <View className="mt-5 gap-5">
            <form.AppForm>
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextInputField
                    label="Název tagu"
                    placeholder="Např. Práce"
                    autoCorrect={false}
                  />
                )}
              />

              <form.AppField
                name="color"
                children={(field) => (
                  <field.ColorPickerField
                    label="Barva"
                    buttonLabel="Vybrat barvu"
                    onPress={() => {
                      setColorPickerValue(field.state.value || COLORS.muted);
                      setShowColorPicker(true);
                    }}
                  />
                )}
              />
            </form.AppForm>
          </View>
        </View>
      </TrueSheet>

      <ColorPicker
        visible={showColorPicker}
        value={colorPickerValue}
        onChange={(value) => {
          setColorPickerValue(value);
          form.setFieldValue("color", value);
        }}
        onConfirm={(value) => {
          setColorPickerValue(value);
          form.setFieldValue("color", value);
        }}
        onClose={() => setShowColorPicker(false)}
        centered
        animationType="fade"
      />
    </>
  );
});

EditTagSheet.displayName = "EditTagSheet";

export default EditTagSheet;
