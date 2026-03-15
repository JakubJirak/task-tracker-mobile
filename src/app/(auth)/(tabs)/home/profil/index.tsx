import ProfileLink from "@/components/home/profil/profileLink";
import ProfileTopBar from "@/components/home/profil/profileTopBar";
import { View } from "react-native";

export default function Profil() {
  return (
    <View className="px-3">
      <ProfileTopBar />
      <View className="gap-2">
        <ProfileLink
          href={"/(auth)/(tabs)/home/profil/tags"}
          icon="pricetag-outline"
          text="Tagy"
        />
        <ProfileLink
          href={"/(auth)/(tabs)/home/profil/stats"}
          icon="stats-chart"
          text="Statistiky"
        />
      </View>
    </View>
  );
}
