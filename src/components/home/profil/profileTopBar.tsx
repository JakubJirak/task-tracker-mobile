import { COLORS } from "@/constants/COLORS";
import AuthContext from "@/contexts/AuthContext";
import { logout } from "@/services/AuthService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileTopBar() {
  const router = useRouter();
  const { setUser } = React.useContext(AuthContext);

  return (
    <View className="flex-row items-center py-4 gap-4">
      <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color={COLORS.accent} />
      </TouchableOpacity>
      <Text className="text-text  text-xl font-semibold flex-1">Profil</Text>
      <TouchableOpacity
        onPress={async () => {
          await logout();
          setUser(null);
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={28}
          color={COLORS.accent}
          className="mr-1"
        />
      </TouchableOpacity>
    </View>
  );
}
