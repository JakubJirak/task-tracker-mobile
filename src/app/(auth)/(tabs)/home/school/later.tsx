import { useSchool } from "@/hooks/useSchool";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function SchoolLater() {
  const { laterSchool, isLoading, isError } = useSchool();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      {isError ? (
        <Text className="text-text mt-3">Nepodařilo se načíst školu.</Text>
      ) : (
        <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-2 pb-24">
            <Text className="text-text">Později ({laterSchool.length})</Text>
            {laterSchool.map((event) => (
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
