import {
  tagsIndexQueryKey,
  tagsStoreMutation,
} from "@/client/@tanstack/react-query.gen";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ColorPicker from "./colorPicker";

type TagCategory = "project" | "task" | "reminder" | "school";

const TAG_CATEGORY_OPTIONS: Array<{
  label: string;
  value: TagCategory;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}> = [
  { label: "Projekt", value: "project", icon: "folder-outline" },
  { label: "Úkol", value: "task", icon: "list-outline" },
  { label: "Událost", value: "reminder", icon: "notifications-outline" },
  { label: "Škola", value: "school", icon: "school-outline" },
];

export default function AddTagSheet() {
  const sheet = useRef<TrueSheet>(null);
  const [tagName, setTagName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.muted);
  const [selectedCategory, setSelectedCategory] =
    useState<TagCategory>("project");

  const present = async () => {
    await sheet.current?.present();
  };

  const queryClient = useQueryClient();

  const addTagMut = useMutation({
    ...tagsStoreMutation(),
    onSuccess: () => {
      sheet.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: tagsIndexQueryKey() });
    },
  });

  const addTag = () => {
    if (!tagName.trim()) return;

    addTagMut.mutate({
      body: {
        name: tagName.trim(),
        color: selectedColor,
        tags_type: selectedCategory,
      },
    });
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
        footer={() => (
          <TouchableOpacity
            onPress={addTag}
            disabled={!tagName.trim()}
            className={`py-3 mx-4 rounded-xl mb-6 bg-accent ${!tagName.trim() && "bg-accent/50"}`}
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg text-center font-semibold">
              Vytvořit
            </Text>
          </TouchableOpacity>
        )}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <Ionicons name="add" size={30} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">Přidat tag</Text>
          </View>

          <View className="mt-5 gap-5">
            <View>
              <Text className="text-text text-lg mb-1.5 font-medium">
                Název tagu
              </Text>
              <TextInput
                className="bg-secondary rounded-lg text-base h-11 px-3 text-text"
                cursorColor={COLORS.text}
                placeholder="Např. Práce"
                placeholderTextColor={COLORS.muted}
                onChange={(e) => setTagName(e.nativeEvent.text)}
              />
            </View>

            <View>
              <Text className="text-text text-lg mb-1.5 font-medium">
                Barva
              </Text>
              <Pressable
                onPress={() => setShowColorPicker(true)}
                className="bg-secondary rounded-lg h-11 px-3 flex-row items-center justify-between"
              >
                <Text className="text-muted text-base">Vybrat barvu</Text>
                <View
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
              </Pressable>
            </View>

            <View>
              <Text className="text-text text-lg mb-1.5 font-medium">Typ</Text>
              <View className="flex-row flex-wrap justify-between gap-y-2">
                {TAG_CATEGORY_OPTIONS.map((option) => {
                  const isActive = selectedCategory === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setSelectedCategory(option.value)}
                      className={`h-12 w-[48%] rounded-lg px-3 flex-row items-center justify-center gap-2  border-secondary bg-secondary ${
                        isActive ? "border border-accent" : "border-none"
                      }`}
                    >
                      <Ionicons
                        name={option.icon}
                        size={18}
                        color={isActive ? "white" : COLORS.muted}
                      />
                      <Text
                        className={`text-base ${
                          isActive ? "text-white font-semibold" : "text-muted"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </TrueSheet>

      <ColorPicker
        visible={showColorPicker}
        value={selectedColor}
        onChange={setSelectedColor}
        onConfirm={setSelectedColor}
        onClose={() => setShowColorPicker(false)}
        centered
        animationType="fade"
      />
    </View>
  );
}
