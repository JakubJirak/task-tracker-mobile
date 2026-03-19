import { EventResource } from "@/client";
import SchoolLi from "@/components/home/school/schoolLi";
import { useSchool } from "@/hooks/useSchool";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

type SchoolSectionItem =
  | { type: "title"; id: string; title: string }
  | { type: "event"; id: string; event: EventResource };

export default function Home() {
  const { allSchool, isLoading, isError } = useSchool();

  const data: SchoolSectionItem[] = [
    { type: "title", id: "title-this-week", title: "Tento týden" },
    ...allSchool.thisWeek.map((event) => ({
      type: "event" as const,
      id: `this-week-${event.id}`,
      event,
    })),
    { type: "title", id: "title-next-week", title: "Příští týden" },
    ...allSchool.nextWeek.map((event) => ({
      type: "event" as const,
      id: `next-week-${event.id}`,
      event,
    })),
    { type: "title", id: "title-later", title: "Později" },
    ...allSchool.later.map((event) => ({
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
        <Text className="text-text mt-3">Nepodařilo se načíst události.</Text>
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
          <SchoolLi school={item.event} />
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
