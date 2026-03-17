import { TaskResource } from "@/client";
import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns/format";
import { cs } from "date-fns/locale/cs";
import { parseISO } from "date-fns/parseISO";
import React from "react";
import { Text, View } from "react-native";

export default function TaskLi({ task }: { task: TaskResource }) {
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

  return (
    <View className="bg-secondary p-3 rounded-xl mb-3">
      <View className="flex-row items-center">
        <Text className="flex-1 text-text text-base font-medium">
          {task.title}
        </Text>
        <View>{task.tag && <Tag tag={task.tag} />}</View>
      </View>
      {task.due_date && (
        <View className="flex-row items-center gap-1.5 mt-1">
          <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
          <Text className="text-muted text-xs">{formatDate()}</Text>
        </View>
      )}

      <Text className="text-text text-sm mt-2">{task.description}</Text>
    </View>
  );
}
