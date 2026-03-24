import {
  projectsShowQueryKey,
  projectsStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { useProjectContext } from "@/contexts/ProjectContext";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

const addSubprojectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Název projektu je povinný")
    .max(64, "Název projektu může mít maximálně 64 znaků"),
  description: z
    .string()
    .trim()
    .min(1, "Popis projektu je povinný")
    .max(255, "Popis může mít maximálně 255 znaků"),
  tag: z.number().int().positive().nullable(),
});

export default function AddSubprojectSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();
  const { projectId } = useProjectContext();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      tag: null as number | null,
    },
    validators: {
      onSubmit: addSubprojectSchema,
    },
    onSubmit: ({ value }) => {
      if (projectId === null || !Number.isFinite(projectId)) {
        return;
      }

      const currentProjectId: number = projectId;

      addSubprojectMut.mutate({
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          tag_id: value.tag,
          parent_id: currentProjectId,
        },
      });
    },
  });

  const addSubprojectMut = useMutation({
    ...projectsStoreMutation(),
    onSuccess: () => {
      form.reset();
      sheet.current?.dismiss();

      if (projectId === null || !Number.isFinite(projectId)) {
        return;
      }

      const currentProjectId: number = projectId;

      queryClient.invalidateQueries({
        queryKey: projectsShowQueryKey({ path: { project: currentProjectId } }),
      });
    },
  });

  return (
    <TrueSheet
      name="addSubproject"
      ref={sheet}
      detents={[0.9, 1]}
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
                addSubprojectMut.isPending ||
                projectId === null ||
                !Number.isFinite(projectId);

              return (
                <form.SubmitButton
                  label="Vytvořit podprojekt"
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
            name="folder-plus"
            size={28}
            color={COLORS.text}
          />
          <Text className="text-text text-xl font-bold">Přidat podprojekt</Text>
        </View>

        <View className="mt-5 gap-5">
          <form.AppForm>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextInputField
                  label="Název"
                  placeholder="Např. Nový podprojekt"
                  autoCorrect={false}
                />
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextInputField
                  label="Popis"
                  placeholder="Např. Krátký popis podprojektu"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-secondary rounded-lg text-base min-h-24 px-3 py-3 text-text"
                />
              )}
            />

            <form.AppField
              name="tag"
              children={(field) => (
                <field.TagSelectorField
                  label="Tag"
                  tagsType="project"
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
