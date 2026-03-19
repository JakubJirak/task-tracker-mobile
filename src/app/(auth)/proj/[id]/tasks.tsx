import { useProjectContext } from "@/contexts/ProjectContext";
import React from "react";
import { ScrollView, Text, View } from "react-native";

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
  const { project, projectId } = useProjectContext();

  return (
    <ScrollView
      className="flex-1 bg-primary px-3 pt-3"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text className="text-text text-lg font-semibold mb-3">Ukoly</Text>
      <Text className="text-muted mb-4">
        Projekt #{projectId ?? "-"}: {project?.data.title ?? "-"}
      </Text>

      {TASKS.map((task) => (
        <View key={task.id} className="bg-secondary rounded-xl p-4 mb-3">
          <Text className="text-text text-base font-semibold">
            {task.title}
          </Text>
          <Text className="text-muted mt-1">Přiřazeno: {task.assignee}</Text>
          <Text className="text-muted mt-1">Stav: {task.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
