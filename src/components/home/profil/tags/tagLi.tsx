import React from "react";
import { Text, View } from "react-native";

export default function TagLi({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center bg-secondary px-3 py-2.5 rounded-xl gap-2">
      <View
        className="size-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-text">{name}</Text>
    </View>
  );
}
