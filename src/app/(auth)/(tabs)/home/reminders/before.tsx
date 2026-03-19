import ReminderLi from "@/components/home/reminders/reminderLi";
import { useReminders } from "@/hooks/useReminders";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

export default function RemindersBefore() {
  const { beforeReminders, isLoading, isError } = useReminders();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst připomínky.</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={beforeReminders}
      renderItem={({ item }) => <ReminderLi reminder={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">
            Žádné dřívější události.
          </Text>
        </View>
      )}
    />
  );
}
