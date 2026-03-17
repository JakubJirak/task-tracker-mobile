import ReminderLi from "@/components/home/reminders/reminderLi";
import { useReminders } from "@/hooks/useReminders";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native";

export default function RemindersBefore() {
  const { beforeReminders, isLoading, isError } = useReminders();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <FlashList
      data={beforeReminders}
      renderItem={({ item }) => <ReminderLi reminder={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-1 px-2"
    />
  );
}
