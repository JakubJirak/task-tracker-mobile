import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddTaskSheet() {
  const sheet = useRef<TrueSheet>(null);

  const dismiss = async () => {
    await sheet.current?.dismiss();
  };

  return (
    <View>
      <TrueSheet
        name="addTask"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        backgroundColor={COLORS.sheet}
      >
        <TouchableOpacity onPress={dismiss}>
          <Text>Dismiss</Text>
        </TouchableOpacity>
        <View className="size-20 m-5 bg-secondary">
          <Text className="text-white">Add Task Sheet</Text>
        </View>
      </TrueSheet>
    </View>
  );
}
