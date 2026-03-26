import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TopBarProps = {
  title: string;
  rightContent?: React.ReactNode;
};

export default function TopBar({ title, rightContent }: TopBarProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center py-4 gap-4">
      <View className="flex-row flex-1 items-center gap-4">
        <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.accent} />
        </TouchableOpacity>
        <Text className="flex-1 text-text text-xl font-semibold">{title}</Text>
      </View>
      {rightContent ?? null}
    </View>
  );
}
