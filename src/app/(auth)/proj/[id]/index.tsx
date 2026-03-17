import { projectsShowOptions } from "@/client/@tanstack/react-query.gen";
import TopBar from "@/components/topBar";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { id } = useLocalSearchParams();

  const { data: project } = useQuery({
    ...projectsShowOptions({ path: { project: Number(id) } }),
  });

  return (
    <View className="px-3">
      <TopBar title={project?.data.title || "Projekt"} />
      <Text>{id}</Text>
    </View>
  );
}
