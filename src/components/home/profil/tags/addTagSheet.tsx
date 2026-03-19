import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import React, { useRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddTagSheet() {
  const sheet = useRef<TrueSheet>(null);

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
        name="addTag"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <Ionicons name="add" size={30} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">Přidat tag</Text>
          </View>
          <View className="mt-5">
            <View>
              <Text className="text-text text-lg mb-1 font-medium">
                Název tagu
              </Text>
              <TextInput
                className="bg-secondary rounded-lg text-lg h-11 px-2"
                cursorColorClassName="accent-gray-300"
              />
            </View>
          </View>
        </View>
      </TrueSheet>
    </View>
  );
}
