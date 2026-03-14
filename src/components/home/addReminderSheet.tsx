import { COLORS } from "@/constants/COLORS";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddReminderSheet() {
  const sheet = useRef<TrueSheet>(null);

  const dismiss = async () => {
    await sheet.current?.dismiss();
  };

  return (
    <View>
      <TrueSheet
        name="addReminder"
        ref={sheet}
        detents={[0.9, 1]}
        cornerRadius={24}
        dimmedDetentIndex={0.1}
        backgroundColor={COLORS.sheet}
      >
        <TouchableOpacity onPress={dismiss}>
          <Text>Dismiss</Text>
        </TouchableOpacity>
      </TrueSheet>
    </View>
  );
}
