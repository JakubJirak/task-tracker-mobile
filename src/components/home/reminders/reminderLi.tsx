import { EventResource } from "@/client";
import {
  eventsDestroyMutation,
  eventsIndexQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { openEditReminderSheet } from "@/components/home/reminders/editReminderSheet";
import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale/cs";
import { Button, Dialog, Menu } from "heroui-native";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

export default function ReminderLi({ reminder }: { reminder: EventResource }) {
  const menuTriggerRef = useRef<React.ElementRef<typeof Menu.Trigger>>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const parsedCreatedAt = parseISO(reminder.due_date);
  const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
    ? reminder.created_at
    : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

  const danger = useCSSVariable("--color-danger");

  const handleUpdate = () => openEditReminderSheet(reminder);

  const deleteReminderMut = useMutation({
    ...eventsDestroyMutation(),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: eventsIndexQueryKey({ query: { event_type: "reminder" } }),
      });
    },
  });

  const handleDelete = () => {
    if (deleteReminderMut.isPending) {
      return;
    }

    deleteReminderMut.mutate({
      path: { event: reminder.id },
    });
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  const handleConfirmDelete = () => handleDelete();

  const openMenuOnHold = () => {
    menuTriggerRef.current?.open();
  };

  return (
    <>
      <Menu>
        <Pressable
          onLongPress={openMenuOnHold}
          delayLongPress={250}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Menu.Trigger ref={menuTriggerRef} isDisabled>
            <View className="bg-secondary p-3 rounded-xl mb-3">
              <View className="flex-row items-center">
                <Text className="flex-1 text-text text-base font-medium">
                  {reminder.title}
                </Text>
                <View>{reminder.tag && <Tag tag={reminder.tag} />}</View>
              </View>
              <View className="flex-row items-center gap-1.5 mt-1">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={COLORS.muted}
                />
                <Text className="text-muted text-xs">{formattedCreatedAt}</Text>
              </View>
              <Text className="text-text text-sm mt-2">
                {reminder.description}
              </Text>
            </View>
          </Menu.Trigger>
        </Pressable>

        <Menu.Portal>
          <Menu.Overlay className="flex-1 bg-black/40" />
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
                <Dialog.Title>Odstranit připomínku</Dialog.Title>
              </View>

              <Dialog.Description>
                Opravdu chcete odstranit tuto připomínku? Tuto akci nelze vrátit
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
