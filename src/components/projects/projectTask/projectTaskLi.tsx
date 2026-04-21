import { ProjectTaskResource } from "@/client";
import {
  projectsShowQueryKey,
  projectsTasksCompleteMutation,
  projectsTasksDestroyMutation,
  projectsTasksIndexQueryKey,
  projectsTasksReopenMutation,
} from "@/client/@tanstack/react-query.gen";
import { invalidateProjectQueries } from "@/components/projects/projectCache";
import { openEditProjectTaskSheet } from "@/components/projects/projectTask/editProjectTaskSheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Button, Checkbox, Dialog, Menu } from "heroui-native";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

export default function ProjectTaskLi({ task }: { task: ProjectTaskResource }) {
  const menuTriggerRef = useRef<React.ElementRef<typeof Menu.Trigger>>(null);
  const didLongPressRef = useRef(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const danger = useCSSVariable("--color-danger");

  const invalidateTaskQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: projectsTasksIndexQueryKey({
        path: { project: task.project_id },
      }),
    });
    await queryClient.invalidateQueries({
      queryKey: projectsShowQueryKey({ path: { project: task.project_id } }),
    });
    await invalidateProjectQueries(queryClient, task.project_id);
  };

  const deleteTaskMut = useMutation({
    ...projectsTasksDestroyMutation(),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      await invalidateTaskQueries();
    },
  });

  const completeTaskMut = useMutation({
    ...projectsTasksCompleteMutation(),
    onSuccess: async () => {
      await invalidateTaskQueries();
    },
  });

  const reopenTaskMut = useMutation({
    ...projectsTasksReopenMutation(),
    onSuccess: async () => {
      await invalidateTaskQueries();
    },
  });

  const openMenuOnHold = () => {
    didLongPressRef.current = true;
    menuTriggerRef.current?.open();
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
  };

  const handleUpdate = () => openEditProjectTaskSheet(task);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  const handleConfirmDelete = () => {
    if (deleteTaskMut.isPending) {
      return;
    }

    deleteTaskMut.mutate({
      path: { project: task.project_id, task: task.id },
    });
  };

  const handleToggleComplete = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    if (
      deleteTaskMut.isPending ||
      completeTaskMut.isPending ||
      reopenTaskMut.isPending
    ) {
      return;
    }

    if (task.is_completed) {
      reopenTaskMut.mutate({
        path: { project: task.project_id, task: task.id },
      });
      return;
    }

    completeTaskMut.mutate({
      path: { project: task.project_id, task: task.id },
    });
  };

  return (
    <>
      <Menu>
        <Pressable
          onPressIn={() => {
            didLongPressRef.current = false;
          }}
          onPress={handleToggleComplete}
          onLongPress={openMenuOnHold}
          delayLongPress={250}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Menu.Trigger
            className={`mb-3 transition-opacity ${task.is_completed ? "opacity-50" : "opacity-100"}`}
            ref={menuTriggerRef}
            isDisabled
          >
            <View className="bg-secondary p-3 rounded-xl ">
              <View className="flex-row items-center">
                <View pointerEvents="none">
                  <Checkbox
                    className="border border-accent size-5 rounded-md"
                    isSelected={task.is_completed}
                  />
                </View>
                <Text className="flex-1 ml-2 text-text text-base font-medium">
                  {task.title}
                </Text>
              </View>

              <Text className="text-text text-sm mt-2">{task.description}</Text>
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
                <Dialog.Title>Odstranit úkol</Dialog.Title>
              </View>

              <Dialog.Description>
                Opravdu chcete odstranit tento úkol? Tuto akci nelze vrátit
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
