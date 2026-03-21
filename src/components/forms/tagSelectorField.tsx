import { tagsIndexOptions } from "@/client/@tanstack/react-query.gen";
import { TagResource } from "@/client/types.gen";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useQuery } from "@tanstack/react-query";
import { Label } from "heroui-native";
import { useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { getFirstFieldErrorMessage } from "./errorMessage";
import { useFieldContext } from "./formCore";

type TagType = "school" | "reminder" | "task" | "project";

type AppTagSelectorFieldProps = {
  label: string;
  tagsType: TagType;
  placeholder?: string;
};

const getTagsFromResponse = (
  response: unknown,
  tagsType: TagType,
): TagResource[] => {
  if (!response || typeof response !== "object") {
    return [];
  }

  if ("data" in response && Array.isArray(response.data)) {
    return response.data as TagResource[];
  }

  if (tagsType in response) {
    const grouped = response[tagsType as keyof typeof response];
    if (Array.isArray(grouped)) {
      return grouped as TagResource[];
    }
  }

  return [];
};

export function AppTagSelectorField({
  label,
  tagsType,
  placeholder = "Vybrat tag",
}: AppTagSelectorFieldProps) {
  const field = useFieldContext<number | null>();
  const tagSheet = useRef<TrueSheet>(null);

  const tagsQuery = useQuery({
    ...tagsIndexOptions({ query: { tags_type: tagsType } }),
    staleTime: 60_000,
  });

  const tags = useMemo(
    () => getTagsFromResponse(tagsQuery.data, tagsType),
    [tagsQuery.data, tagsType],
  );

  const selectedTag = tags.find((tag) => tag.id === field.state.value) ?? null;

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const presentTags = async () => {
    await tagSheet.current?.present();
  };

  const selectTag = async (tagId: number) => {
    field.handleChange(tagId);
    field.handleBlur();
    await tagSheet.current?.dismiss();
  };

  return (
    <>
      <View>
        <Label className="mb-1.5 ml-1">{label}</Label>
        <Pressable
          onPress={presentTags}
          className="bg-secondary rounded-lg h-14 px-3.5 flex-row items-center justify-between"
        >
          {selectedTag ? (
            <View className="flex-row items-center gap-2">
              <View
                className="size-4 rounded-full"
                style={{ backgroundColor: selectedTag.color }}
              />
              <Text className="text-text text-base">{selectedTag.name}</Text>
            </View>
          ) : (
            <Text className="text-muted text-base">{placeholder}</Text>
          )}
        </Pressable>
        {hasError ? (
          <Text className="text-red-400 text-xs mt-1">
            {getFirstFieldErrorMessage(field.state.meta.errors)}
          </Text>
        ) : null}
      </View>

      <TrueSheet
        name="tagSelectorField"
        ref={tagSheet}
        detents={[0.9]}
        cornerRadius={24}
        dimmedDetentIndex={0}
        backgroundColor={COLORS.sheet}
      >
        <View className="px-3 pt-6">
          <Text className="text-text text-xl font-bold self-center mb-4">
            Vyberte tag
          </Text>

          {tagsQuery.isLoading ? (
            <Text className="text-muted text-base text-center">
              Načítám tagy...
            </Text>
          ) : null}

          {!tagsQuery.isLoading && tags.length === 0 ? (
            <Text className="text-muted text-base text-center">
              Pro tento typ nejsou dostupné žádné tagy.
            </Text>
          ) : null}

          <View className="gap-2">
            {tags.map((tag) => {
              const isSelected = field.state.value === tag.id;

              return (
                <Pressable
                  key={tag.id}
                  onPress={() => selectTag(tag.id)}
                  className={`rounded-lg px-3 h-14 flex-row items-center justify-between bg-secondary ${
                    isSelected ? "border border-accent" : "border-none"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? "text-white font-semibold" : "text-text"
                    }`}
                  >
                    {tag.name}
                  </Text>
                  <View
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </TrueSheet>
    </>
  );
}
