import {
  tasksIndexQueryKey,
  tasksStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Href, useRouter } from "expo-router";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const addTaskSchema = z.object({
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

type AddTaskSheetProps = {
  showTrigger?: boolean;
  registerSheet?: boolean;
  redirectOnSuccessTo?: Href;
};

let pendingTaskRedirectTarget: Href | undefined;

export const openAddTaskSheet = async (options?: {
  redirectOnSuccessTo?: Href;
}) => {
  pendingTaskRedirectTarget = options?.redirectOnSuccessTo;
  await TrueSheet.present("addTask");
};

export default function AddTaskSheet({
  showTrigger = true,
  registerSheet = true,
  redirectOnSuccessTo,
}: AddTaskSheetProps) {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const addTaskMut = useMutation({
    ...tasksStoreMutation(),
    onSuccess: async () => {
      form.reset();
      await sheet.current?.dismiss();
      await queryClient.invalidateQueries({ queryKey: tasksIndexQueryKey() });

      const redirectTarget = pendingTaskRedirectTarget ?? redirectOnSuccessTo;

      if (redirectTarget) {
        router.push(redirectTarget);
      }

      pendingTaskRedirectTarget = undefined;
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      due_date: null as Date | null,
      tag: null as number | null,
    },
    validators: {
      onSubmit: addTaskSchema,
    },
    onSubmit: ({ value }) => {
      addTaskMut.mutate({
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          due_date: value.due_date
            ? format(value.due_date, "yyyy-MM-dd")
            : null,
          tag_id: value.tag,
        },
      });
    },
  });

  const present = async () => {
    await openAddTaskSheet();
  };

  return (
    <View className={showTrigger ? "relative flex-1" : undefined}>
      {showTrigger ? (
        <TouchableOpacity
          onPress={present}
          className="bg-accent p-4 rounded-2xl absolute right-0 shadow-lg shadow-primary"
          activeOpacity={0.6}
        >
          <MaterialDesignIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      ) : null}
      {registerSheet ? (
        <TrueSheet
          name="addTask"
          ref={sheet}
          detents={[0.9, 1]}
          cornerRadius={24}
          dimmedDetentIndex={0.1}
          backgroundColor={COLORS.sheet}
          onDidDismiss={() => {
            pendingTaskRedirectTarget = undefined;
          }}
          footer={() => (
            <form.AppForm>
              <form.Subscribe
                selector={(state) => ({
                  title: state.values.title,
                  description: state.values.description,
                })}
              >
                {({ title, description }) => {
                  const isDisabled =
                    !title.trim() ||
                    !description.trim() ||
                    addTaskMut.isPending;

                  return (
                    <form.SubmitButton
                      label="Přidat úkol"
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
              <MaterialDesignIcons
                name="clipboard-plus-outline"
                size={28}
                color={COLORS.text}
              />
              <Text className="text-text text-xl font-bold">Přidat úkol</Text>
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
                      className="bg-secondary border-secondary rounded-lg text-base min-h-20 px-3 py-3 text-text"
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
      ) : null}
    </View>
  );
}
