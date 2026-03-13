import { COLORS } from "@/constants/COLORS";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View className="bg-primary">
        <Text className="text-text">LOGIN</Text>
      </View>
    </SafeAreaView>
  );
}
