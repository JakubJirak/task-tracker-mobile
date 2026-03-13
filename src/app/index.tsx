import { COLORS } from "@/constants/COLORS";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View className="bg-primary flex-1 items-center pt-30">
        <Text className="text-text text-4xl font-light">
          Vítejte v aplikaci
        </Text>
        <Text className="text-accent-600 text-[44px] font-semibold">
          TASK TRACKER
        </Text>
        <View className="mt-auto block w-full px-4 mb-10 gap-4">
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-text py-4 rounded-lg"
          >
            <Text className="text-black text-center text-lg">
              Pokračovat s Google
            </Text>
          </TouchableOpacity>
          <Link href={"/register"} asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-accent py-4 rounded-lg"
            >
              <Text className="text-white text-center text-lg">
                Pokračovat pomocí emailu
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
