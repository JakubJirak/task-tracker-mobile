import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function EventsTopBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center pt-4 gap-4 px-3">
      <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color={COLORS.accent600} />
      </TouchableOpacity>
      <Text className="text-text  text-xl font-semibold">{title}</Text>
    </View>
  );
}
