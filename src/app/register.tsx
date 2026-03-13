import { COLORS } from "@/constants/COLORS";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View className="bg-primary">
        <Text className="text-text">REGISTER</Text>
      </View>
    </SafeAreaView>
  );
}
