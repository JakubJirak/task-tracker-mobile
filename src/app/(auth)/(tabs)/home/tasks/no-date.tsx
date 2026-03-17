import { useTasks } from "@/hooks/useTasks";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Home() {
  const { nonCompletedNoDateTasks: noDateTasks, isLoading, isError } = useTasks();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      {isError ? (
        <Text className="text-text mt-3">Nepodařilo se načíst úkoly.</Text>
      ) : (
        <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-2 pb-24">
            <Text className="text-text">Bez data ({noDateTasks.length})</Text>
            {noDateTasks.map((task) => (
              <Text key={task.id} className="text-text">
                {task.title}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
