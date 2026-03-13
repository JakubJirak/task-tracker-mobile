import HomeFAB from "@/components/home/home-FAB";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="bg-primary relative flex-1">
      <Text className="text-text">
        Edit src/app/home.tsx to edit this screen.
      </Text>
      <View className="absolute top-0 left-0 right-3 bottom-0">
        <HomeFAB />
      </View>
    </View>
  );
}
