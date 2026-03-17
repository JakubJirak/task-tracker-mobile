import { useReminders } from "@/hooks/useReminders";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Home() {
  const { allReminders, isLoading, isError } = useReminders();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      {isError ? (
        <Text className="text-text mt-3">Nepodařilo se načíst připomínky.</Text>
      ) : (
        <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-24">
            <View className="gap-2">
              <Text className="text-text">Tento týden</Text>
              {allReminders.thisWeek.map((event) => (
                <Text key={event.id} className="text-text">
                  {event.title}
                </Text>
              ))}
            </View>

            <View className="gap-2">
              <Text className="text-text">Příští týden</Text>
              {allReminders.nextWeek.map((event) => (
                <Text key={event.id} className="text-text">
                  {event.title}
                </Text>
              ))}
            </View>

            <View className="gap-2">
              <Text className="text-text">Později</Text>
              {allReminders.later.map((event) => (
                <Text key={event.id} className="text-text">
                  {event.title}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
