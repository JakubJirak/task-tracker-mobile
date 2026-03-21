import {
  eventsIndexQueryKey,
  eventsStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const addSchoolSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Název školní události je povinný")
    .max(64, "Název školní události může mít maximálně 64 znaků"),
  description: z
    .string()
    .trim()
    .min(1, "Popis školní události je povinný")
    .max(255, "Popis může mít maximálně 255 znaků"),
  date: z.date({ message: "Datum je povinné" }),
  tag: z.number().int().positive().nullable(),
});

export default function AddSchoolSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();

  const addSchoolMut = useMutation({
    ...eventsStoreMutation(),
    onSuccess: () => {
      form.reset();
      sheet.current?.dismiss();
      queryClient.invalidateQueries({
        queryKey: eventsIndexQueryKey({ query: { event_type: "school" } }),
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      tag: null as number | null,
    },
    validators: {
      onSubmit: addSchoolSchema,
    },
    onSubmit: ({ value }) => {
      addSchoolMut.mutate({
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          due_date: format(value.date, "yyyy-MM-dd"),
          event_type: "school",
          tag_id: value.tag,
        },
      });
    },
  });

  const present = async () => {
    await sheet.current?.present();
  };

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
        name="addSchool"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
        footer={() => (
          <form.AppForm>
            <form.Subscribe
              selector={(state) => ({
                title: state.values.title,
                description: state.values.description,
                date: state.values.date,
              })}
            >
              {({ title, description, date }) => {
                const isDisabled =
                  !title.trim() ||
                  !description.trim() ||
                  !date ||
                  addSchoolMut.isPending;

                return (
                  <form.SubmitButton
                    label="Vytvořit školní událost"
                    pendingLabel="Vytvářím..."
                    disabled={isDisabled}
                  />
                );
              }}
            </form.Subscribe>
          </form.AppForm>
        )}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <MaterialDesignIcons name="school" size={28} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">
              Přidat školní událost
            </Text>
          </View>

          <View className="mt-5 gap-5">
            <form.AppForm>
              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextInputField
                    label="Název"
                    placeholder="Např. Test z matematiky"
                    autoCorrect={false}
                  />
                )}
              />

              <form.AppField
                name="description"
                children={(field) => (
                  <field.TextInputField
                    label="Popis"
                    placeholder="Např. Opakování kapitol 1-4"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="bg-secondary rounded-lg text-base min-h-24 px-3 py-3 text-text"
                  />
                )}
              />

              <form.AppField
                name="date"
                children={(field) => (
                  <field.DatePickerField
                    label="Datum"
                    placeholder="Vybrat datum"
                  />
                )}
              />

              <form.AppField
                name="tag"
                children={(field) => (
                  <field.TagSelectorField
                    label="Tag"
                    tagsType="school"
                    placeholder="Vybrat tag"
                  />
                )}
              />
            </form.AppForm>
          </View>
        </View>
      </TrueSheet>
    </View>
  );
}
