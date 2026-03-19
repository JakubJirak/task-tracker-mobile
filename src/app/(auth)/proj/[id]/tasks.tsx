import ProjectTaskLi from "@/components/projects/projectTaskLi";
import { useProjectContext } from "@/contexts/ProjectContext";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const TASKS = [
  {
    id: "t-1",
    title: "Nastavit autentizaci",
    assignee: "Jakub",
    status: "Rozpracováno",
  },
  {
    id: "t-2",
    title: "Přidat obrazovku registrace",
    assignee: "Anna",
    status: "K revizi",
  },
  {
    id: "t-3",
    title: "Napojit endpointy projektů",
    assignee: "Petr",
    status: "Todo",
  },
  {
    id: "t-4",
    title: "Otestovat navigaci",
    assignee: "Lucie",
    status: "Todo",
  },
];

export default function TasksScreen() {
  const { project, isLoading, isError } = useProjectContext();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst úkoly.</Text>
      </View>
    );
  }

  const tasks = project?.data.tasks ?? [];

  return (
    <FlashList
      data={tasks}
      renderItem={({ item }) => <ProjectTaskLi task={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">Žádné úkoly.</Text>
        </View>
      )}
    />
  );
}
