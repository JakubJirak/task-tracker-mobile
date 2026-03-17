import { useReminders } from "@/hooks/useReminders";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function RemindersThisWeek() {
  const { thisWeekReminders, isLoading, isError } = useReminders();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      {isError ? (
        <Text className="text-text mt-3">Nepodařilo se načíst připomínky.</Text>
      ) : (
        <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-2 pb-24">
            <Text className="text-text">
              Tento týden ({thisWeekReminders.length})
            </Text>
            {thisWeekReminders.map((event) => (
              <Text key={event.id} className="text-text">
                {event.title}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
