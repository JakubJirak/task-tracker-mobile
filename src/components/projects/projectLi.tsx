import { ProjectResource } from "@/client";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import Tag from "../tag";

export default function ProjectLi({ project }: { project: ProjectResource }) {
  const router = useRouter();
  const parsedCreatedAt = parseISO(project.created_at);
  const formattedCreatedAt = Number.isNaN(parsedCreatedAt.getTime())
    ? project.created_at
    : format(parsedCreatedAt, "d. MMMM yyyy", { locale: cs });

  const handlePress = () => {
    router.push({
      pathname: "/proj/[id]",
      params: { id: project.id.toString() },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      className="bg-secondary p-4 rounded-xl mb-3"
    >
      <View className="flex-row items-center mb-0.5">
        <Text className="text-text text-lg font-medium flex-1">
          {project.title}
        </Text>
        {project.tag && <Tag tag={project.tag} />}
      </View>

      <View className="flex-row gap-1.5 items-center">
        <Ionicons name="calendar-outline" size={16} color={COLORS.muted} />
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
    </TouchableOpacity>
  );
}
