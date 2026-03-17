import { TagResource } from "@/client";
import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Text, View } from "react-native";

type TagPreview = Pick<TagResource, "id" | "name" | "color">;

export type TagDetailSheetHandle = {
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
};

type TagDetailSheetProps = {
  tag: TagPreview | null;
};

const TagDetailSheet = forwardRef<TagDetailSheetHandle, TagDetailSheetProps>(
  ({ tag }, ref) => {
    const sheet = useRef<TrueSheet>(null);

    useImperativeHandle(ref, () => ({
      present: async () => {
        await sheet.current?.present();
      },
      dismiss: async () => {
        await sheet.current?.dismiss();
      },
    }));

    return (
      <TrueSheet
        name="tagDetail"
        ref={sheet}
        detents={[0.4]}
        cornerRadius={24}
        backgroundColor={COLORS.sheet}
      >
        <View className="px-5 py-5 gap-4">
          <Text className="text-text text-xl font-semibold">Tag detail</Text>

          <View className="gap-2">
            <Text className="text-muted">ID</Text>
            <Text className="text-text">{tag?.id ?? "-"}</Text>
          </View>

          <View className="gap-2">
            <Text className="text-muted">Name</Text>
            <Text className="text-text">{tag?.name ?? "-"}</Text>
          </View>

          <View className="gap-2">
            <Text className="text-muted">Color</Text>
            <View className="flex-row items-center gap-2">
              <View
                className="size-3 rounded-full"
                style={{ backgroundColor: tag?.color ?? COLORS.muted }}
              />
              <Text className="text-text">{tag?.color ?? "-"}</Text>
            </View>
          </View>
        </View>
      </TrueSheet>
    );
  },
);

TagDetailSheet.displayName = "TagDetailSheet";

export default TagDetailSheet;
