import TopBar from "@/components/topBar";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="bg-primary relative flex-1">
      <TopBar title="Škola" />
      <Text className="text-text">school</Text>
    </View>
  );
}
