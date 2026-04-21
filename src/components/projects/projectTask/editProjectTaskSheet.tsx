import {
  projectsShowQueryKey,
  projectsTasksIndexQueryKey,
  projectsTasksUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { ProjectTaskResource } from "@/client/types.gen";
import { useAppForm } from "@/components/forms/formContext";
import { invalidateProjectQueries } from "@/components/projects/projectCache";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type ProjectTaskPreview = Pick<
  ProjectTaskResource,
  "id" | "title" | "description" | "is_completed" | "project_id"
>;

let activeProjectTaskDraft: ProjectTaskPreview | null = null;

export const openEditProjectTaskSheet = async (task: ProjectTaskPreview) => {
  activeProjectTaskDraft = task;
  await TrueSheet.present("editProjectTask");
};

const editProjectTaskSchema = z.object({
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
});

export default function EditProjectTaskSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: editProjectTaskSchema,
    },
    onSubmit: ({ value }) => {
      if (!activeProjectTaskDraft) return;

      editProjectTaskMut.mutate({
        path: {
          project: activeProjectTaskDraft.project_id,
          task: activeProjectTaskDraft.id,
        },
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          project_id: activeProjectTaskDraft.project_id,
          is_completed: activeProjectTaskDraft.is_completed,
        },
      });
    },
  });

  const editProjectTaskMut = useMutation({
    ...projectsTasksUpdateMutation(),
    onSuccess: async () => {
      if (!activeProjectTaskDraft) {
        return;
      }

      form.reset();
      sheet.current?.dismiss();
      await queryClient.invalidateQueries({
        queryKey: projectsTasksIndexQueryKey({
          path: { project: activeProjectTaskDraft.project_id },
        }),
      });
      await queryClient.invalidateQueries({
        queryKey: projectsShowQueryKey({
          path: { project: activeProjectTaskDraft.project_id },
        }),
      });
      await invalidateProjectQueries(
        queryClient,
        activeProjectTaskDraft.project_id,
      );
    },
  });

  const hydrateFromTask = (task: ProjectTaskPreview) => {
    form.reset();

    form.setFieldValue("title", task.title);
    form.setFieldValue("description", task.description ?? "");
  };

  return (
    <TrueSheet
      name="editProjectTask"
      ref={sheet}
      detents={[0.7, 1]}
      cornerRadius={24}
      dimmedDetentIndex={0.1}
      backgroundColor={COLORS.sheet}
      onWillPresent={() => {
        if (activeProjectTaskDraft) {
          hydrateFromTask(activeProjectTaskDraft);
        } else {
          form.reset();
        }
      }}
      onDidDismiss={() => {
        activeProjectTaskDraft = null;
        form.reset();
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
              const originalTitle = activeProjectTaskDraft?.title.trim() ?? "";
              const originalDescription =
                activeProjectTaskDraft?.description?.trim() ?? "";

              const currentTitle = title.trim();
              const currentDescription = description.trim();

              const isUnchanged =
                currentTitle === originalTitle &&
                currentDescription === originalDescription;

              const isDisabled =
                !currentTitle ||
                !currentDescription ||
                isUnchanged ||
                editProjectTaskMut.isPending;

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
          <MaterialDesignIcons
            name="clipboard-edit-outline"
            size={24}
            color={COLORS.text}
          />
          <Text className="text-text text-xl font-bold">Upravit úkol</Text>
        </View>

        <View className="mt-5 gap-5">
          <form.AppForm>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextInputField
                  label="Název"
                  placeholder="Např. Dokončit projektovou část"
                  autoCorrect={false}
                />
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextInputField
                  label="Popis"
                  placeholder="Např. Upravit dokumentaci a testy"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-secondary border-secondary rounded-lg text-base min-h-20 px-3 py-3 text-text"
                />
              )}
            />
          </form.AppForm>
        </View>
      </View>
    </TrueSheet>
  );
}
