import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function TagLi({
  id,
  name,
  color,
  onPress,
}: {
  id: number;
  name: string;
  color: string;
  onPress: (id: number) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      activeOpacity={0.6}
      className="flex-row items-center bg-secondary px-3 py-2.5 rounded-xl gap-2"
    >
      <View
        className="size-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-text flex-1">{name}</Text>
      <Ionicons name="pencil" size={16} color={COLORS.muted} />
    </TouchableOpacity>
  );
}
