import TopBar from "@/components/topBar";
import AuthContext from "@/contexts/AuthContext";
import { logout } from "@/services/AuthService";
import { Link } from "expo-router";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profil() {
  const { setUser } = useContext(AuthContext);
  return (
    <View>
      <TopBar title="Profil" />
      <Link href="/(auth)/(tabs)/home/profil/tags">
        <Text className="text-text">Tagy</Text>
      </Link>
      <Link href="/(auth)/(tabs)/home/profil/stats">
        <Text className="text-text">Statistiky</Text>
      </Link>
      <TouchableOpacity
        className="bg-accent py-3 rounded-xl"
        onPress={async () => {
          await logout();
          setUser(null);
        }}
      >
        <Text className="text-text text-center font-semibold">ODHLÁSIT SE</Text>
      </TouchableOpacity>
    </View>
  );
}
