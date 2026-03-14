import TopBar from "@/components/topBar";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="bg-primary relative flex-1">
      <TopBar title="Tagy" />
      <Text className="text-text">tags</Text>
    </View>
  );
}
