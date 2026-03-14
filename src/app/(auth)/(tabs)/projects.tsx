import AddProjectSheet from "@/components/projects/addProjectSheet";
import { Text, View } from "react-native";

export default function Projects() {
  return (
    <View className="bg-primary relative flex-1">
      <Text className="text-text">
        Edit src/app/projects.tsx to edit this screen.
      </Text>
      <View className="absolute left-0 right-7 bottom-22">
        <AddProjectSheet />
      </View>
    </View>
  );
}
