import {
  projectsShowQueryKey,
  projectsTasksStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { useAppForm } from "@/components/forms/formContext";
import { invalidateProjectQueries } from "@/components/projects/projectCache";
import { COLORS } from "@/constants/COLORS";
import { useProjectContext } from "@/contexts/ProjectContext";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

const addTaskToProjectSchema = z.object({
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

export default function AddTaskToProjectSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();
  const { projectId } = useProjectContext();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: addTaskToProjectSchema,
    },
    onSubmit: ({ value }) => {
      if (projectId === null || !Number.isFinite(projectId)) {
        return;
      }

      const currentProjectId: number = projectId;

      addTaskMut.mutate({
        path: { project: currentProjectId },
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          project_id: currentProjectId,
        },
      });
    },
  });

  const addTaskMut = useMutation({
    ...projectsTasksStoreMutation(),
    onSuccess: async () => {
      form.reset();
      sheet.current?.dismiss();

      if (projectId === null || !Number.isFinite(projectId)) {
        return;
      }

      const currentProjectId: number = projectId;

      await queryClient.invalidateQueries({
        queryKey: projectsShowQueryKey({ path: { project: currentProjectId } }),
      });
      await invalidateProjectQueries(queryClient, currentProjectId);
    },
  });

  return (
    <TrueSheet
      name="addTaskToProject"
      ref={sheet}
      detents={[0.7, 1]}
      cornerRadius={24}
      dimmedDetentIndex={0.1}
      backgroundColor={COLORS.sheet}
      onDidDismiss={() => {
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
              const isDisabled =
                !title.trim() ||
                !description.trim() ||
                addTaskMut.isPending ||
                projectId === null ||
                !Number.isFinite(projectId);

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
                  placeholder="Např. Dopsat dokumentaci"
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
