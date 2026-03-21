import {
  tagsIndexQueryKey,
  tagsStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import ColorPicker from "./colorPicker";

type TagCategory = "project" | "task" | "reminder" | "school";
const isIPad = Platform.OS === "ios" && Platform.isPad;

const TAG_CATEGORY_OPTIONS: Array<{
  label: string;
  value: TagCategory;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}> = [
  { label: "Projekt", value: "project", icon: "folder-outline" },
  { label: "Úkol", value: "task", icon: "list-outline" },
  { label: "Událost", value: "reminder", icon: "notifications-outline" },
  { label: "Škola", value: "school", icon: "school-outline" },
];

const addTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Název tagu je povinný")
    .max(20, "Název tagu musí mít maximálně 20 znaků"),
  color: z.string().min(1, "Barva tagu je povinná"),
  tags_type: z.enum(["project", "task", "reminder", "school"]),
});

export default function AddTagSheet() {
  const sheet = useRef<TrueSheet>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerValue, setColorPickerValue] = useState<string>(
    COLORS.muted,
  );

  const insets = useSafeAreaInsets();
  const bottomInset = isIPad ? 0 : insets.bottom;

  const present = async () => {
    await sheet.current?.present();
  };

  const queryClient = useQueryClient();

  const addTagMut = useMutation({
    ...tagsStoreMutation(),
    onSuccess: () => {
      form.reset();
      setColorPickerValue(COLORS.muted);
      setShowColorPicker(false);
      sheet.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: tagsIndexQueryKey() });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      color: COLORS.muted as string,
      tags_type: "project" as TagCategory,
    },
    validators: {
      onChange: addTagSchema,
    },
    onSubmit: ({ value }) => {
      addTagMut.mutate({
        body: {
          name: value.name.trim(),
          color: value.color,
          tags_type: value.tags_type,
        },
      });
    },
  });

  return (
    <View className="relative flex-1">
      <TouchableOpacity
        onPress={present}
        className="bg-accent p-4 rounded-2xl absolute right-0"
        activeOpacity={0.6}
      >
        <MaterialDesignIcons name="plus" size={24} color="white" />
      </TouchableOpacity>

      <TrueSheet
        name="addTag"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
        footer={() => (
          <View style={{ paddingBottom: bottomInset }}>
            <form.AppForm>
              <form.Subscribe
                selector={(state) => ({
                  name: state.values.name,
                  color: state.values.color,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ name, color, isSubmitting }) => {
                  const isDisabled =
                    !name.trim() ||
                    !color.trim() ||
                    addTagMut.isPending ||
                    isSubmitting;

                  return (
                    <form.SubmitButton
                      label="Vytvořit"
                      pendingLabel="Vytvářím..."
                      disabled={isDisabled}
                    />
                  );
                }}
              </form.Subscribe>
            </form.AppForm>
          </View>
        )}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <Ionicons name="add" size={30} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">Přidat tag</Text>
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

              <form.AppField
                name="tags_type"
                children={(field) => (
                  <field.CategorySelectorField
                    label="Typ"
                    options={TAG_CATEGORY_OPTIONS}
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
    </View>
  );
}
