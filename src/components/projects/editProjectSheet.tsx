import {
  projectsIndexQueryKey,
  projectsShowQueryKey,
  projectsUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { ProjectResource } from "@/client/types.gen";
import { useAppForm } from "@/components/forms/formContext";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Text, View } from "react-native";
import { z } from "zod";

type ProjectPreview = Pick<
  ProjectResource,
  "id" | "title" | "description" | "tag" | "is_completed" | "parent_id"
>;

let activeProjectDraft: ProjectPreview | null = null;

export const openEditProjectSheet = async (project: ProjectPreview) => {
  activeProjectDraft = project;
  await TrueSheet.present("editProject");
};

const editProjectSchema = z.object({
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

export default function EditProjectSheet() {
  const sheet = useRef<TrueSheet>(null);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      tag: null as number | null,
    },
    validators: {
      onSubmit: editProjectSchema,
    },
    onSubmit: ({ value }) => {
      if (!activeProjectDraft) {
        return;
      }

      editProjectMut.mutate({
        path: { project: activeProjectDraft.id },
        body: {
          title: value.title.trim(),
          description: value.description.trim(),
          tag_id: value.tag,
          is_completed: activeProjectDraft.is_completed,
          parent_id: activeProjectDraft.parent_id,
        },
      });
    },
  });

  const editProjectMut = useMutation({
    ...projectsUpdateMutation(),
    onSuccess: async () => {
      if (!activeProjectDraft) {
        return;
      }

      form.reset();
      sheet.current?.dismiss();

      await queryClient.invalidateQueries({
        predicate: (query) =>
          (query.queryKey[0] as { _id?: string } | undefined)?._id ===
          "projectsIndex",
      });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          (query.queryKey[0] as { _id?: string } | undefined)?._id ===
          "projectsShow",
      });
      await queryClient.refetchQueries({
        predicate: (query) =>
          (query.queryKey[0] as { _id?: string } | undefined)?._id ===
          "projectsIndex",
        type: "all",
      });

      await queryClient.invalidateQueries({
        queryKey: projectsIndexQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: projectsShowQueryKey({
          path: { project: activeProjectDraft.id },
        }),
      });
    },
  });

  const hydrateFromProject = (project: ProjectPreview) => {
    form.reset();

    form.setFieldValue("title", project.title);
    form.setFieldValue("description", project.description ?? "");
    form.setFieldValue("tag", project.tag?.id ?? null);
  };

  return (
    <TrueSheet
      name="editProject"
      ref={sheet}
      detents={[0.9, 1]}
      cornerRadius={24}
      dimmedDetentIndex={0.1}
      backgroundColor={COLORS.sheet}
      onWillPresent={() => {
        if (activeProjectDraft) {
          hydrateFromProject(activeProjectDraft);
        } else {
          form.reset();
        }
      }}
      onDidDismiss={() => {
        activeProjectDraft = null;
        form.reset();
      }}
      footer={() => (
        <form.AppForm>
          <form.Subscribe
            selector={(state) => ({
              title: state.values.title,
              description: state.values.description,
              tag: state.values.tag,
            })}
          >
            {({ title, description, tag }) => {
              const originalTitle = activeProjectDraft?.title.trim() ?? "";
              const originalDescription =
                activeProjectDraft?.description?.trim() ?? "";
              const originalTag = activeProjectDraft?.tag?.id ?? null;

              const currentTitle = title.trim();
              const currentDescription = description.trim();

              const isUnchanged =
                currentTitle === originalTitle &&
                currentDescription === originalDescription &&
                tag === originalTag;

              const isDisabled =
                !currentTitle ||
                !currentDescription ||
                isUnchanged ||
                editProjectMut.isPending;

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
            name="folder-edit"
            size={24}
            color={COLORS.text}
          />
          <Text className="text-text text-xl font-bold">Upravit projekt</Text>
        </View>

        <View className="mt-5 gap-5">
          <form.AppForm>
            <form.AppField
              name="title"
              children={(field) => (
                <field.TextInputField
                  label="Název"
                  placeholder="Např. Nový projekt"
                  autoCorrect={false}
                />
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.TextInputField
                  label="Popis"
                  placeholder="Např. Krátký popis projektu"
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
