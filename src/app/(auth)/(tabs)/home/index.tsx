import HomeFAB from "@/components/home/home-FAB";
import { COLORS } from "@/constants/COLORS";
import AuthContext from "@/contexts/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <View className="bg-primary relative flex-1 px-3">
      <View className="flex flex-row pt-3 pb-2 items-center">
        <View className="flex-row flex-1 gap-3 items-center">
          <Ionicons name="home-outline" size={24} color={COLORS.accent600} />
          <Text className="text-text text-xl font-bold">Domů</Text>
        </View>

        <View className="items-center flex-row gap-3">
          <Text className="text-text text-base">{user?.data?.name}</Text>

          <Link href={"/(auth)/(tabs)/home/profil"} asChild>
            <TouchableOpacity
              activeOpacity={0.5}
              className="bg-secondary self-end p-2 rounded-xl"
            >
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="gap-3 mt-3">
        <Link href={"/(auth)/(tabs)/home/tasks"}>
          <View className="bg-secondary w-full rounded-xl flex-row items-center gap-3 p-3">
            <MaterialIcons name="task-alt" size={24} color={COLORS.accent600} />
            <Text className="text-text text-base">Úkoly</Text>
          </View>
        </Link>

        <Link href={"/(auth)/(tabs)/home/reminders"}>
          <View className="bg-secondary w-full rounded-xl flex-row items-center gap-3 p-3">
            <MaterialIcons
              name="notifications"
              size={24}
              color={COLORS.accent600}
            />
            <Text className="text-text text-base">Události</Text>
          </View>
        </Link>
        <Link href={"/(auth)/(tabs)/home/school"}>
          <View className="bg-secondary w-full rounded-xl flex-row items-center gap-3 p-3">
            <MaterialIcons name="school" size={24} color={COLORS.accent600} />
            <Text className="text-text text-base">Škola</Text>
          </View>
        </Link>
      </View>

      <View className="absolute top-0 left-0 right-3 bottom-0">
        <HomeFAB />
      </View>
    </View>
  );
}
