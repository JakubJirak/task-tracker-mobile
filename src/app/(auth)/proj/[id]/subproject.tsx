import ProjectLi from "@/components/projects/projectLi";
import { useProjectContext } from "@/contexts/ProjectContext";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SubprojectScreen() {
  const { project, isLoading, isError } = useProjectContext();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">
          Nepodařilo se načíst podprojekty.
        </Text>
      </View>
    );
  }

  const subprojects = project?.data.subprojects ?? [];

  return (
    <FlashList
      data={subprojects}
      renderItem={({ item }) => <ProjectLi project={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">
            Žádné podprojekty.
          </Text>
        </View>
      )}
    />
  );
}
