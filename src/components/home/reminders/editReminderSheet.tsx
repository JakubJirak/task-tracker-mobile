import {
  eventsIndexQueryKey,
  eventsUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { EventResource } from "@/client/types.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type ReminderPreview = Pick<
  EventResource,
  "id" | "title" | "description" | "due_date" | "tag" | "event_type"
>;

let activeReminderDraft: ReminderPreview | null = null;

export const openEditReminderSheet = async (reminder: ReminderPreview) => {
  activeReminderDraft = reminder;
  await TrueSheet.present("editReminder");
};

const editReminderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Název připomínky je povinný")
    .max(64, "Název připomínky může mít maximálně 64 znaků"),
  description: z
    .string()
    .trim()
    .min(1, "Popis připomínky je povinný")
    .max(255, "Popis může mít maximálně 255 znaků"),
  date: z.date({ message: "Datum je povinné" }),
  tag: z.number().int().positive().nullable(),
});

export default function EditReminderSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      tag: null as number | null,
    },
    validators: {
      onSubmit: editReminderSchema,
    },
    onSubmit: ({ value }) => {
      if (!activeReminderDraft) return;

      editReminderMut.mutate({
        path: { event: activeReminderDraft.id },
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          due_date: format(value.date, "yyyy-MM-dd"),
          event_type: "reminder",
          tag_id: value.tag,
        },
      });
    },
  });

  const editReminderMut = useMutation({
    ...eventsUpdateMutation(),
    onSuccess: () => {
      form.reset();
      sheet.current?.dismiss();
      queryClient.invalidateQueries({
        queryKey: eventsIndexQueryKey({ query: { event_type: "reminder" } }),
      });
    },
  });

  const hydrateFromReminder = (reminder: ReminderPreview) => {
    form.reset();

    const parsedDueDate = parseISO(reminder.due_date);

    form.setFieldValue("title", reminder.title);
    form.setFieldValue("description", reminder.description ?? "");
    form.setFieldValue(
      "date",
      Number.isNaN(parsedDueDate.getTime()) ? new Date() : parsedDueDate,
    );
    form.setFieldValue("tag", reminder.tag?.id ?? null);
  };

  return (
    <TrueSheet
      name="editReminder"
      ref={sheet}
      detents={[0.9, 1]}
      cornerRadius={24}
      dimmedDetentIndex={0.1}
      backgroundColor={COLORS.sheet}
      onWillPresent={() => {
        if (activeReminderDraft) {
          hydrateFromReminder(activeReminderDraft);
        } else {
          form.reset();
        }
      }}
      onDidDismiss={() => {
        activeReminderDraft = null;
        form.reset();
      }}
      footer={() => (
        <form.AppForm>
          <form.Subscribe
            selector={(state) => ({
              title: state.values.title,
              description: state.values.description,
              date: state.values.date,
              tag: state.values.tag,
            })}
          >
            {({ title, description, date, tag }) => {
              const originalTitle = activeReminderDraft?.title.trim() ?? "";
              const originalDescription =
                activeReminderDraft?.description?.trim() ?? "";
              const originalTag = activeReminderDraft?.tag?.id ?? null;
              const originalDate = activeReminderDraft
                ? format(parseISO(activeReminderDraft.due_date), "yyyy-MM-dd")
                : "";

              const currentTitle = title.trim();
              const currentDescription = description.trim();
              const currentDate = date ? format(date, "yyyy-MM-dd") : "";

              const isUnchanged =
                currentTitle === originalTitle &&
                currentDescription === originalDescription &&
                currentDate === originalDate &&
                tag === originalTag;

              const isDisabled =
                !currentTitle ||
                !currentDescription ||
                !date ||
                isUnchanged ||
                editReminderMut.isPending;

              return (
                <form.SubmitButton
                  label="Uložit změny"
                  pendingLabel="Ukládám..."
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
          <MaterialDesignIcons name="pencil" size={24} color={COLORS.text} />
          <Text className="text-text text-xl font-bold">Upravit událost</Text>
        </View>

        <View className="mt-5 gap-5">
          <form.AppForm>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextInputField
                  label="Název"
                  placeholder="Název události"
                  autoCorrect={false}
                />
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextInputField
                  label="Popis"
                  placeholder="Popis události"
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
                  label="Tag (nepovinné)"
                  tagsType="reminder"
                  placeholder="Vybrat tag"
                />
              )}
            />
          </form.AppForm>
        </View>
      </View>
    </TrueSheet>
  );
}
