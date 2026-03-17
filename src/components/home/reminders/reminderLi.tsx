import { EventResource } from "@/client";
import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale/cs";
import React from "react";
import { Text, View } from "react-native";

export default function ReminderLi({ reminder }: { reminder: EventResource }) {
  const parsedCreatedAt = parseISO(reminder.due_date);
  const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
    ? reminder.created_at
    : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

  return (
    <View className="bg-secondary p-3 rounded-xl mb-3">
      <View className="flex-row items-center">
        <Text className="flex-1 text-text text-base font-medium">
          {reminder.title}
        </Text>
        <View>{reminder.tag && <Tag tag={reminder.tag} />}</View>
      </View>
      <View className="flex-row items-center gap-1.5 mt-1">
        <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
        <Text className="text-muted text-xs">{formattedCreatedAt}</Text>
      </View>
      <Text className="text-text text-sm mt-2">{reminder.description}</Text>
    </View>
  );
}
