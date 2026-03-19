import { useProjectContext } from "@/contexts/ProjectContext";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { project, isLoading, isError } = useProjectContext();

  if (isLoading || project === undefined) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst projekt.</Text>
      </View>
    );
  }

  return (
    <View className="px-3 relative">
      <View>
        <View>
          <Text>{project?.data.description}</Text>
        </View>
      </View>
    </View>
  );
}
