import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ProjectResource } from "@/client";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { useRouter } from "expo-router";

export default function ProjectLi({ project }: { project: ProjectResource }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/proj/[id]",
      params: { id: project.id.toString() },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-secondary px-4 pb-4 pt-3 rounded-xl"
    >
      <View className="flex-row items-center mb-2">
        <Text className="text-text text-lg font-medium flex-1">
          {project.title}
        </Text>
        <View>
          <Text>{project.tag?.name}</Text>
        </View>
      </View>

      <View className="flex-row gap-1">
        <Ionicons name="calendar-outline" size={20} color={COLORS.muted} />
        <Text className="text-muted">{project.created_at}</Text>
      </View>
    </TouchableOpacity>
  );
}
