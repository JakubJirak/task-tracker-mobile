import TopBar from "@/components/topBar";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="bg-primary relative flex-1 px-3">
      <TopBar title="Události" />
      <Text className="text-text">reminders</Text>
    </View>
  );
}
