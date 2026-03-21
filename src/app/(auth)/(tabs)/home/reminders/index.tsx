import { EventResource } from "@/client";
import ReminderLi from "@/components/home/reminders/reminderLi";
import { useReminders } from "@/hooks/useReminders";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

type ReminderSectionItem =
  | { type: "title"; id: string; title: string }
  | { type: "event"; id: string; event: EventResource };

export default function Home() {
  const { allReminders, isLoading, isError } = useReminders();

  const data: ReminderSectionItem[] = [
    { type: "title", id: "title-today", title: "Dnes" },
    ...allReminders.today.map((event) => ({
      type: "event" as const,
      id: `today-${event.id}`,
      event,
    })),
    { type: "title", id: "title-this-week", title: "Tento týden" },
    ...allReminders.thisWeek.map((event) => ({
      type: "event" as const,
      id: `this-week-${event.id}`,
      event,
    })),
    { type: "title", id: "title-next-week", title: "Příští týden" },
    ...allReminders.nextWeek.map((event) => ({
      type: "event" as const,
      id: `next-week-${event.id}`,
      event,
    })),
    { type: "title", id: "title-later", title: "Později" },
    ...allReminders.later.map((event) => ({
      type: "event" as const,
      id: `later-${event.id}`,
      event,
    })),
  ];

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
      data={data}
      renderItem={({ item }) =>
        item.type === "title" ? (
          <Text className="text-text text-base font-medium mt-3 mb-2 px-2">
            {item.title}
          </Text>
        ) : (
          <ReminderLi reminder={item.event} />
        )
      }
      keyExtractor={(item) => item.id}
      className="mt-3 px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">Žádné události.</Text>
        </View>
      )}
    />
  );
}
