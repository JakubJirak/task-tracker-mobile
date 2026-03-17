import { TagResource } from "@/client";
import React from "react";
import { Text, View } from "react-native";

export default function Tag({ tag }: { tag: TagResource }) {
  return (
    <View
      style={{ borderColor: tag.color }}
      className="border px-2 py-1 rounded-full"
    >
      <Text className="text-text text-xs">{tag.name}</Text>
    </View>
  );
}
