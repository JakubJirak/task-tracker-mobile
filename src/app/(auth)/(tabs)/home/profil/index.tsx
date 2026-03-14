import TopBar from "@/components/topBar";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Profil() {
  return (
    <View>
      <TopBar title="Profil" />
      <Link href="/(auth)/(tabs)/home/profil/tags">
        <Text className="text-text">Tagy</Text>
      </Link>
      <Link href="/(auth)/(tabs)/home/profil/stats">
        <Text className="text-text">Statistiky</Text>
      </Link>
    </View>
  );
}
