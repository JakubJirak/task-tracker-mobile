import { EventResource } from "@/client";
import { openEditSchoolSheet } from "@/components/home/school/editSchoolSheet";
import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale/cs";
import { Menu } from "heroui-native";
import React, { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type SchoolLiProps = {
  school: EventResource;
};

export default function SchoolLi({ school }: SchoolLiProps) {
  const menuTriggerRef = useRef<React.ElementRef<typeof Menu.Trigger>>(null);

  const parsedCreatedAt = parseISO(school.due_date);
  const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
    ? school.created_at
    : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

  const handleUpdate = () => {
    openEditSchoolSheet(school);
  };
  const handleDelete = () => undefined;

  const danger = useCSSVariable("--color-danger");

  const openMenuOnHold = () => {
    menuTriggerRef.current?.open();
    s;
  };

  return (
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
                {school.title}
              </Text>
              <View>{school.tag && <Tag tag={school.tag} />}</View>
            </View>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Ionicons
                name="calendar-outline"
                size={14}
                color={COLORS.muted}
              />
              <Text className="text-muted text-xs">{formattedCreatedAt}</Text>
            </View>
            <Text className="text-text text-sm mt-2">{school.description}</Text>
          </View>
        </Menu.Trigger>
      </Pressable>

      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content
          className="bg-sheet rounded-xl p-2"
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
          <Menu.Item variant="danger" onPress={handleDelete}>
            <Menu.ItemTitle>
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color={danger as string}
                />
                <Text className="text-base font-medium text-danger">
                  Smazat
                </Text>
              </View>
            </Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}
