import { tagsIndexOptions } from "@/client/@tanstack/react-query.gen";
import AddReminderSheet from "@/components/home/addReminderSheet";
import AddSchoolSheet from "@/components/home/addSchoolSheet";
import AddTaskSheet from "@/components/home/addTaskSheet";
import HomeFAB from "@/components/home/home-FAB";
import { COLORS } from "@/constants/COLORS";
import AuthContext from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user } = useContext(AuthContext);

  const { data: tags } = useQuery({
    ...tagsIndexOptions(),
  });

  return (
    <View className="bg-primary relative flex-1">
      <View className="flex flex-row items-center">
        <View className="flex-row flex-1 gap-3 items-center px-2 py-3">
          <Ionicons name="home-outline" size={24} color={COLORS.accent} />
          <Text className="text-text text-xl font-bold">Domů</Text>
        </View>

        <Text className="text-text">{user?.data?.name}</Text>

        <Link href={"/(auth)/(tabs)/home/profil"} asChild>
          <TouchableOpacity
            activeOpacity={0.5}
            className="bg-secondary self-end m-4 p-2 rounded-xl"
          >
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <TouchableOpacity onPress={() => console.log(tags)}>
        <Text className="text-text">Tags:</Text>
      </TouchableOpacity>

      <Link href={"/(auth)/(tabs)/home/school"}>
        <Text className="text-text">School</Text>
      </Link>
      <Link href={"/(auth)/(tabs)/home/tasks"}>
        <Text className="text-text">Tasks</Text>
      </Link>
      <Link href={"/(auth)/(tabs)/home/reminders"}>
        <Text className="text-text">Reminders</Text>
      </Link>
      <AddReminderSheet />
      <AddTaskSheet />
      <AddSchoolSheet />
      <View className="absolute top-0 left-0 right-3 bottom-0">
        <HomeFAB />
      </View>
    </View>
  );
}
