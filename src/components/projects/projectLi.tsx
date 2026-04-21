import { ProjectResource } from "@/client";
import {
  projectsCompleteMutation,
  projectsDestroyMutation,
  projectsReopenMutation,
  projectsShowQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { openEditProjectSheet } from "@/components/projects/editProjectSheet";
import {
  invalidateProjectQueries,
  syncProjectCompletionInCache,
} from "@/components/projects/projectCache";
import { COLORS } from "@/constants/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Button, Dialog, Menu } from "heroui-native";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useCSSVariable } from "uniwind";
import Tag from "../tag";

export default function ProjectLi({ project }: { project: ProjectResource }) {
  const menuTriggerRef = useRef<React.ElementRef<typeof Menu.Trigger>>(null);
  const didLongPressRef = useRef(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const danger = useCSSVariable("--color-danger");

  const parsedCreatedAt = parseISO(project.created_at);
  const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
    ? project.created_at
    : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

  const completeProjectMut = useMutation({
    ...projectsCompleteMutation(),
    onMutate: async () => {
      syncProjectCompletionInCache(queryClient, project.id, true);
    },
    onError: () => {
      syncProjectCompletionInCache(queryClient, project.id, false);
    },
    onSettled: async () => {
      await invalidateProjectQueries(queryClient, project.id);
    },
  });

  const reopenProjectMut = useMutation({
    ...projectsReopenMutation(),
    onMutate: async () => {
      syncProjectCompletionInCache(queryClient, project.id, false);
    },
    onError: () => {
      syncProjectCompletionInCache(queryClient, project.id, true);
    },
    onSettled: async () => {
      await invalidateProjectQueries(queryClient, project.id);
    },
  });

  const deleteProjectMut = useMutation({
    ...projectsDestroyMutation(),
    onSuccess: async () => {
      const parentProjectId = project.parent_id;
      const deletedProjectId = project.id;

      setIsDeleteDialogOpen(false);
      await invalidateProjectQueries(queryClient, deletedProjectId);
      queryClient.removeQueries({
        queryKey: projectsShowQueryKey({ path: { project: deletedProjectId } }),
      });

      if (parentProjectId) {
        router.replace({
          pathname: "/proj/[id]",
          params: { id: parentProjectId.toString() },
        });
        return;
      }

      router.replace("/projects");
    },
  });

  const openMenuOnHold = () => {
    didLongPressRef.current = true;
    menuTriggerRef.current?.open();
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
  };

  const handlePress = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    router.push({
      pathname: "/proj/[id]",
      params: { id: project.id.toString() },
    });
  };

  const handleUpdate = () => {
    openEditProjectSheet(project);
  };

  const handleToggleCompletion = () => {
    if (
      completeProjectMut.isPending ||
      reopenProjectMut.isPending ||
      deleteProjectMut.isPending
    ) {
      return;
    }

    if (project.is_completed) {
      reopenProjectMut.mutate({
        path: { project: project.id },
      });
      return;
    }

    completeProjectMut.mutate({
      path: { project: project.id },
    });
  };

  const openDeleteDialog = () => {
    if (deleteProjectMut.isPending) {
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteProjectMut.isPending) {
      return;
    }

    deleteProjectMut.mutate({
      path: { project: project.id },
    });
  };

  return (
    <>
      <Menu>
        <Pressable
          onPressIn={() => {
            didLongPressRef.current = false;
          }}
          onPress={handlePress}
          onLongPress={openMenuOnHold}
          delayLongPress={250}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Menu.Trigger ref={menuTriggerRef} isDisabled>
            <View
              className={`bg-secondary p-4 rounded-xl mb-3 ${project.is_completed ? "opacity-50" : ""}`}
            >
              <View className="flex-row items-center mb-0.5">
                <Text className="text-text text-lg font-medium flex-1">
                  {project.title}
                </Text>
                {project.tag && <Tag tag={project.tag} />}
              </View>

              <View className="flex-row gap-1.5 items-center">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text className="text-muted">{formattedCreatedAt}</Text>
              </View>

              <View className="flex-row gap-2 mt-3 items-center">
                <ProgressBar
                  progress={project.completion_percentage / 100}
                  color={COLORS.accent}
                  className="w-[87%]"
                />
                <Text className="text-text text-right text-sm">
                  {project.completion_percentage}%
                </Text>
              </View>
            </View>
          </Menu.Trigger>
        </Pressable>

        <Menu.Portal>
          <Menu.Overlay className="flex-1 bg-black/50" />
          <Menu.Content
            className="bg-secondary rounded-xl p-2 -mt-10"
            presentation="popover"
            width={180}
            placement="bottom"
          >
            <Menu.Item onPress={handleUpdate}>
              <Menu.ItemTitle>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons name="edit" size={20} color="white" />
                  <Text className="text-base font-medium text-white">
                    Upravit
                  </Text>
                </View>
              </Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item onPress={handleToggleCompletion}>
              <Menu.ItemTitle>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons
                    name={
                      project.is_completed ? "history" : "check-circle-outline"
                    }
                    size={20}
                    color="white"
                  />
                  <Text className="text-base font-medium text-white">
                    {project.is_completed ? "Otevřít" : "Splnit"}
                  </Text>
                </View>
              </Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item variant="danger" onPress={openDeleteDialog}>
              <Menu.ItemTitle>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={danger as string}
                  />
                  <Text className="text-base font-medium text-danger">
                    Odstranit
                  </Text>
                </View>
              </Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>

      <Dialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="flex-1 bg-black/60" />
          <Dialog.Content className="bg-secondary">
            <View className="mb-5 gap-1.5">
              <View className="flex-row items-center gap-2">
                <View>
                  <View className="bg-danger-soft p-1 rounded-full">
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color={danger as string}
                    />
                  </View>
                </View>
                <Dialog.Title>Odstranit projekt</Dialog.Title>
              </View>

              <Dialog.Description>
                Opravdu chcete odstranit tento projekt? Tuto akci nelze vrátit
                zpět.
              </Dialog.Description>
            </View>

            <View className="flex-row justify-end gap-3">
              <Button
                variant="tertiary"
                size="sm"
                onPress={() => setIsDeleteDialogOpen(false)}
              >
                Zrušit
              </Button>
              <Button
                size="sm"
                variant="danger-soft"
                onPress={handleConfirmDelete}
              >
                Odstranit
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
