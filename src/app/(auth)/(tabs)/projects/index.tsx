import ProjectLi from "@/components/projects/projectLi";
import { useProjects } from "@/hooks/useProjects";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

export default function Projects() {
  const { uncompletedProjects, isLoading } = useProjects();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <FlashList
      data={uncompletedProjects}
      renderItem={({ item }) => <ProjectLi project={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">
            Žádné nesplněné projekty.
          </Text>
        </View>
      )}
    />
  );
}
