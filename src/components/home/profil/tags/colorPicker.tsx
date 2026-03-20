import { COLORS } from "@/constants/COLORS";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import ColorPickerLib, { HueSlider, Panel1 } from "reanimated-color-picker";

type ColorPickerProps = {
  visible: boolean;
  value?: string;
  onClose: () => void;
  onConfirm?: (hex: string) => void;
  onChange?: (hex: string) => void;
  centered?: boolean;
  animationType?: "none" | "slide" | "fade";
};

export default function ColorPicker({
  visible,
  value = "#ff0000",
  onClose,
  onConfirm,
  onChange,
  centered = true,
  animationType = "fade",
}: ColorPickerProps) {
  const [draftColor, setDraftColor] = useState<string>(value);

  useEffect(() => {
    if (visible) {
      setDraftColor(value || COLORS.muted);
    }
  }, [visible, value]);

  const overlayAlignment = centered ? "justify-center" : "justify-end";
  const containerShape = centered ? "rounded-3xl" : "rounded-t-3xl";
  const containerWidth = centered ? "w-[90%] max-w-md self-center" : "";

  const handleDone = () => {
    onConfirm?.(draftColor);
    onClose();
  };

  const handleColorChange = ({ hex }: { hex: string }) => {
    setDraftColor(hex);
    onChange?.(hex);
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable className="absolute inset-0 bg-black/70" onPress={onClose} />

        <View className={`flex-1 ${overlayAlignment} px-4`}>
          <View
            className={`${containerShape} ${containerWidth} bg-primary px-5 pb-6 pt-5`}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-text text-lg font-semibold">
                Vyber barvu
              </Text>
            </View>

            <View
              className="h-12 w-full rounded-md mb-2"
              style={{ backgroundColor: draftColor, borderColor: COLORS.muted }}
            />

            <ColorPickerLib
              style={{ width: "100%" }}
              value={draftColor}
              onChangeJS={handleColorChange}
              onCompleteJS={handleColorChange}
            >
              <Panel1 />
              <HueSlider boundedThumb={true} />
            </ColorPickerLib>

            <Pressable
              onPress={handleDone}
              className="mt-5 items-center rounded-xl bg-accent px-4 py-3"
            >
              <Text className="font-semibold text-white">Hotovo</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
