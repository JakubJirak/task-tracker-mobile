import { ProjectTaskResource } from "@/client";
import React from "react";
import { Text, View } from "react-native";

export default function ProjectTaskLi({ task }: { task: ProjectTaskResource }) {
  return (
    <View className="bg-secondary p-3 rounded-xl mb-3">
      <Text className="flex-1 text-text text-base font-medium">
        {task.title}
      </Text>

      <Text className="text-text text-sm mt-2">{task.description}</Text>
    </View>
  );
}
