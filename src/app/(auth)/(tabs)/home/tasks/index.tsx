import TaskLi from "@/components/home/tasks/taskLi";
import { useTasks } from "@/hooks/useTasks";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

export default function Home() {
  const { allTasks, isLoading, isError } = useTasks();

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

  return (
    <FlashList
      data={allTasks}
      renderItem={({ item }) => <TaskLi task={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-2 px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}
