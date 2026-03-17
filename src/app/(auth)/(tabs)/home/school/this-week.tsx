import SchoolLi from "@/components/home/school/schoolLi";
import { useSchool } from "@/hooks/useSchool";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, Text, View } from "react-native";

export default function SchoolThisWeek() {
  const { thisWeekSchool, isLoading, isError } = useSchool();

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
      data={thisWeekSchool}
      renderItem={({ item }) => <SchoolLi school={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-2 px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}
