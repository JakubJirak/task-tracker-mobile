import { COLORS } from "@/constants/COLORS";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View className="bg-primary">
        <Text className="text-text">REGISTER</Text>
        <Link href="/login">
          <Text className="text-text">Go to Login</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
