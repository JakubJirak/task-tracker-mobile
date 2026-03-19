import ProjectLi from "@/components/projects/projectLi";
import { useProjects } from "@/hooks/useProjects";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

export default function Projects() {
  const { completedProjects, isLoading, isError } = useProjects();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst projekty.</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={completedProjects}
      renderItem={({ item }) => <ProjectLi project={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">
            Žádné splněné projekty.
          </Text>
        </View>
      )}
    />
  );
}
