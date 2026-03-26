import { TaskResource } from "@/client";
import {
  tasksCompleteMutation,
  tasksDestroyMutation,
  tasksIndexQueryKey,
  tasksReopenMutation,
} from "@/client/@tanstack/react-query.gen";
import { openEditTaskSheet } from "@/components/home/tasks/editTaskSheet";
import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { cs } from "date-fns/locale/cs";
import { parseISO } from "date-fns/parseISO";
import * as Haptics from "expo-haptics";
import { Button, Checkbox, Dialog, Menu } from "heroui-native";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

type TaskLiProps = {
  task: TaskResource;
  animateLayout?: boolean;
  onToggleStart?: () => void;
};

export default function TaskLi({
  task,
  animateLayout = false,
  onToggleStart,
}: TaskLiProps) {
  const menuTriggerRef = useRef<React.ElementRef<typeof Menu.Trigger>>(null);
  const didLongPressRef = useRef(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const queryClient = useQueryClient();
  const isTaskCompleted = (task.is_completed && !isReopening) || isCompleting;

  const refreshTasks = async () => {
    await queryClient.invalidateQueries({ queryKey: tasksIndexQueryKey() });
    await queryClient.refetchQueries({
      queryKey: tasksIndexQueryKey(),
      type: "active",
    });
  };

  const formatDate = () => {
    if (!task.due_date) {
      return null;
    }

    const parsedCreatedAt = parseISO(task.due_date);
    const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
      ? task.created_at
      : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

    return formattedCreatedAt;
  };

  const danger = useCSSVariable("--color-danger");

  const handleUpdate = () => openEditTaskSheet(task);

  const deleteTaskMut = useMutation({
    ...tasksDestroyMutation(),
    onSuccess: async () => {
      setIsDeleteDialogOpen(false);
      await refreshTasks();
    },
  });

  const completeTaskMut = useMutation({
    ...tasksCompleteMutation(),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshTasks();
    },
    onSettled: () => {
      setIsCompleting(false);
    },
  });

  const reopenTaskMut = useMutation({
    ...tasksReopenMutation(),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshTasks();
    },
    onSettled: () => {
      setIsReopening(false);
    },
  });

  const handleDelete = () => {
    if (deleteTaskMut.isPending) {
      return;
    }

    deleteTaskMut.mutate({
      path: { task: task.id },
    });
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  const handleConfirmDelete = () => handleDelete();

  const openMenuOnHold = () => {
    didLongPressRef.current = true;
    menuTriggerRef.current?.open();
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
  };

  const handleToggleComplete = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    if (
      isCompleting ||
      isReopening ||
      completeTaskMut.isPending ||
      reopenTaskMut.isPending ||
      deleteTaskMut.isPending
    ) {
      return;
    }

    onToggleStart?.();

    if (task.is_completed) {
      setIsReopening(true);
      reopenTaskMut.mutate({
        path: { task: task.id },
      });
      return;
    }

    setIsCompleting(true);
    completeTaskMut.mutate({
      path: { task: task.id },
    });
  };

  return (
    <>
      <Animated.View
        layout={animateLayout ? LinearTransition.duration(200) : undefined}
      >
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
              ref={menuTriggerRef}
              isDisabled
              className={`mb-3 ${isTaskCompleted ? "opacity-50" : "opacity-100"}`}
            >
              <View className="bg-secondary p-3 rounded-xl">
                <View className="flex-row items-center">
                  <Checkbox
                    className="border border-accent size-5 rounded-md"
                    isSelected={isTaskCompleted}
                  />
                  <Text className="flex-1 ml-2 text-text text-base/tight font-medium">
                    {task.title}
                  </Text>
                  <View>{task.tag && <Tag tag={task.tag} />}</View>
                </View>
                {task.due_date && (
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={COLORS.muted}
                    />
                    <Text className="text-muted text-xs">{formatDate()}</Text>
                  </View>
                )}

                <Text className="text-text text-sm mt-2">
                  {task.description}
                </Text>
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
      </Animated.View>

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
