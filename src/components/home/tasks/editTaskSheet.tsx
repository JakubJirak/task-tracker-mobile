import {
  tasksIndexQueryKey,
  tasksUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { TaskResource } from "@/client/types.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type TaskPreview = Pick<
  TaskResource,
  "id" | "title" | "description" | "due_date" | "tag" | "is_completed"
>;

let activeTaskDraft: TaskPreview | null = null;

export const openEditTaskSheet = async (task: TaskPreview) => {
  activeTaskDraft = task;
  await TrueSheet.present("editTask");
};

const editTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Název úkolu je povinný")
    .max(64, "Název úkolu může mít maximálně 64 znaků"),
  description: z
    .string()
    .trim()
    .min(1, "Popis úkolu je povinný")
    .max(255, "Popis může mít maximálně 255 znaků"),
  due_date: z.date().nullable(),
  tag: z.number().int().positive().nullable(),
});

export default function EditTaskSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      due_date: null as Date | null,
      tag: null as number | null,
    },
    validators: {
      onSubmit: editTaskSchema,
    },
    onSubmit: ({ value }) => {
      if (!activeTaskDraft) return;

      taskUpdateMut.mutate({
        path: { task: activeTaskDraft.id },
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          due_date: value.due_date
            ? format(value.due_date, "yyyy-MM-dd")
            : null,
          tag_id: value.tag,
          is_completed: activeTaskDraft.is_completed,
        },
      });
    },
  });

  const taskUpdateMut = useMutation({
    ...tasksUpdateMutation(),
    onSuccess: () => {
      form.reset();
      sheet.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: tasksIndexQueryKey() });
    },
  });

  const hydrateFromTask = (task: TaskPreview) => {
    form.reset();

    const parsedDueDate = task.due_date ? parseISO(task.due_date) : null;

    form.setFieldValue("title", task.title);
    form.setFieldValue("description", task.description ?? "");
    form.setFieldValue(
      "due_date",
      parsedDueDate && !Number.isNaN(parsedDueDate.getTime())
        ? parsedDueDate
        : null,
    );
    form.setFieldValue("tag", task.tag?.id ?? null);
  };

  return (
    <TrueSheet
      name="editTask"
      ref={sheet}
      detents={[0.9, 1]}
      cornerRadius={24}
      dimmedDetentIndex={0.1}
      backgroundColor={COLORS.sheet}
      onWillPresent={() => {
        if (activeTaskDraft) {
          hydrateFromTask(activeTaskDraft);
        } else {
          form.reset();
        }
      }}
      onDidDismiss={() => {
        activeTaskDraft = null;
        form.reset();
      }}
      footer={() => (
        <form.AppForm>
          <form.Subscribe
            selector={(state) => ({
              title: state.values.title,
              description: state.values.description,
              due_date: state.values.due_date,
              tag: state.values.tag,
            })}
          >
            {({ title, description, due_date, tag }) => {
              const originalTitle = activeTaskDraft?.title.trim() ?? "";
              const originalDescription =
                activeTaskDraft?.description?.trim() ?? "";
              const originalTag = activeTaskDraft?.tag?.id ?? null;
              const originalDate = activeTaskDraft?.due_date ?? null;

              const currentTitle = title.trim();
              const currentDescription = description.trim();
              const currentDate = due_date
                ? format(due_date, "yyyy-MM-dd")
                : null;

              const isUnchanged =
                currentTitle === originalTitle &&
                currentDescription === originalDescription &&
                currentDate === originalDate &&
                tag === originalTag;

              const isDisabled =
                !currentTitle ||
                !currentDescription ||
                isUnchanged ||
                taskUpdateMut.isPending;

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
          <Text className="text-text text-xl font-bold">Upravit úkol</Text>
        </View>

        <View className="mt-5 gap-5">
          <form.AppForm>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextInputField
                  label="Název"
                  placeholder="Např. Dokončit domácí úkol"
                  autoCorrect={false}
                />
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextInputField
                  label="Popis"
                  placeholder="Např. Připravit body prezentace"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-secondary rounded-lg text-base min-h-24 px-3 py-3 text-text"
                />
              )}
            />

            <form.AppField
              name="due_date"
              children={(field) => (
                <field.DatePickerField
                  label="Termín (nepovinné)"
                  placeholder="Bez termínu"
                />
              )}
            />

            <form.AppField
              name="tag"
              children={(field) => (
                <field.TagSelectorField
                  label="Tag (nepovinné)"
                  tagsType="task"
                  placeholder="Bez tagu"
                />
              )}
            />
          </form.AppForm>
        </View>
      </View>
    </TrueSheet>
  );
}
