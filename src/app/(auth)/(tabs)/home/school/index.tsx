import { EventResource } from "@/client";
import SchoolLi from "@/components/home/school/schoolLi";
import { useSchool } from "@/hooks/useSchool";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

type SchoolSectionItem =
  | { type: "title"; id: string; title: string }
  | { type: "event"; id: string; event: EventResource };

const buildSection = (
  events: EventResource[],
  titleId: string,
  title: string,
  keyPrefix: string,
): SchoolSectionItem[] => {
  if (events.length === 0) {
    return [];
  }

  return [
    { type: "title", id: titleId, title },
    ...events.map((event) => ({
      type: "event" as const,
      id: `${keyPrefix}-${event.id}`,
      event,
    })),
  ];
};

export default function Home() {
  const { allSchool, isLoading, isError } = useSchool();

  const data: SchoolSectionItem[] = [
    ...buildSection(allSchool.today, "title-today", "Dnes", "today"),
    ...buildSection(
      allSchool.thisWeek,
      "title-this-week",
      "Tento týden",
      "this-week",
    ),
    ...buildSection(
      allSchool.nextWeek,
      "title-next-week",
      "Příští týden",
      "next-week",
    ),
    ...buildSection(allSchool.later, "title-later", "Později", "later"),
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
