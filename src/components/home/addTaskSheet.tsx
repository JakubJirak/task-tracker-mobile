import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddTaskSheet() {
  const sheet = useRef<TrueSheet>(null);

  const dismiss = async () => {
    await sheet.current?.dismiss();
  };

  const present = async () => {
    await sheet.current?.present();
  };

  return (
    <View className="relative flex-1">
      <TouchableOpacity
        onPress={present}
        className="bg-accent p-4 rounded-2xl absolute right-0"
        activeOpacity={0.6}
      >
        <MaterialDesignIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
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
