import { useProjects } from "@/hooks/useProjects";
import { ActivityIndicator, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ProjectLi from "@/components/projects/projectLi";

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
    />
  );
}
