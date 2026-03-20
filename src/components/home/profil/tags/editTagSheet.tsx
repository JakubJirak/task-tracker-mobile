import {
  tagsIndexQueryKey,
  tagsUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import { TagResource } from "@/client/types.gen";
import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ColorPicker from "./colorPicker";

type TagCategory = "project" | "task" | "reminder" | "school";

type TagPreview = Pick<TagResource, "id" | "name" | "color" | "tags_type">;

const toTagCategory = (value?: string): TagCategory => {
  if (value === "task" || value === "reminder" || value === "school") {
    return value;
  }
  return "project";
};

export type EditTagSheetHandle = {
  present: (tag: TagPreview) => Promise<void>;
  dismiss: () => Promise<void>;
};

const EditTagSheet = forwardRef<EditTagSheetHandle, {}>((_, ref) => {
  const sheet = useRef<TrueSheet>(null);
  const activeTagRef = useRef<TagPreview | null>(null);
  const queryClient = useQueryClient();

  const [tagName, setTagName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.muted);

  const hydrateFromTag = (tag: TagPreview) => {
    activeTagRef.current = tag;
    setTagName(tag.name);
    setSelectedColor(tag.color);
  };

  const editTagMut = useMutation({
    ...tagsUpdateMutation(),
    onSuccess: () => {
      sheet.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: tagsIndexQueryKey() });
    },
  });

  const trimmedName = tagName.trim();
  const currentTag = activeTagRef.current;
  const nameUnchanged = currentTag
    ? trimmedName === currentTag.name.trim()
    : true;
  const colorUnchanged = currentTag
    ? selectedColor.toLowerCase() === currentTag.color.toLowerCase()
    : true;
  const isSaveDisabled =
    !trimmedName ||
    !selectedColor?.trim() ||
    (nameUnchanged && colorUnchanged) ||
    editTagMut.isPending;

  useImperativeHandle(ref, () => ({
    present: async (tag) => {
      hydrateFromTag(tag);
      await sheet.current?.present();
    },
    dismiss: async () => {
      setShowColorPicker(false);
      await sheet.current?.dismiss();
    },
  }));

  const updateTag = () => {
    if (!activeTagRef.current || !trimmedName || !selectedColor?.trim()) return;

    editTagMut.mutate({
      path: { tag: activeTagRef.current.id },
      body: {
        name: trimmedName,
        color: selectedColor,
        tags_type: toTagCategory(activeTagRef.current.tags_type),
      },
    });
  };

  return (
    <>
      <TrueSheet
        name="editTag"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
        footer={() => (
          <TouchableOpacity
            onPress={updateTag}
            disabled={isSaveDisabled}
            className={`py-3 mx-4 rounded-xl mb-6 bg-accent ${isSaveDisabled && "bg-accent/50"}`}
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg text-center font-semibold">
              Uložit
            </Text>
          </TouchableOpacity>
        )}
      >
        <View className="px-3 pt-6">
          <View className="flex-row self-center mt-3 items-center gap-2">
            <Ionicons name="pencil" size={24} color={COLORS.text} />
            <Text className="text-text text-xl font-bold">Upravit tag</Text>
          </View>

          <View className="mt-5 gap-5">
            <View>
              <Text className="text-text text-lg mb-1.5 font-medium">
                Název tagu
              </Text>
              <TextInput
                value={tagName}
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
    </>
  );
});

EditTagSheet.displayName = "EditTagSheet";

export default EditTagSheet;
