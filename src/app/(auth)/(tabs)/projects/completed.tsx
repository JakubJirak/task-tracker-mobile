import { useProjects } from "@/hooks/useProjects";
import { ActivityIndicator, Text, View } from "react-native";

export default function Projects() {
  const { completedProjects, isLoading, isError } = useProjects();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      {isError ? (
        <Text className="text-text">Nepodařilo se načíst projekty.</Text>
      ) : (
        <View className="gap-2">
          <Text className="text-text">
            Splněné ({completedProjects.length})
          </Text>
          {completedProjects.map((project) => (
            <Text key={project.id} className="text-text">
              {project.title}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
