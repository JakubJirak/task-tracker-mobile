import AddReminderSheet from "@/components/home/reminders/addReminderSheet";
import AddSchoolSheet from "@/components/home/school/addSchoolSheet";
import AddTaskSheet from "@/components/home/tasks/addTaskSheet";
import { COLORS } from "@/constants/COLORS";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: COLORS.primary },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="school" options={{ headerShown: false }} />
        <Stack.Screen name="tasks" options={{ headerShown: false }} />
        <Stack.Screen name="reminders" options={{ headerShown: false }} />
        <Stack.Screen name="profil" options={{ headerShown: false }} />
      </Stack>

      <AddTaskSheet showTrigger={false} />
      <AddReminderSheet showTrigger={false} />
      <AddSchoolSheet showTrigger={false} />
    </View>
  );
}
