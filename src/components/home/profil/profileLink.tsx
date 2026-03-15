import { COLORS } from "@/constants/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type LinkHref = React.ComponentProps<typeof Link>["href"];
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type ProfileLinkProps = {
  href: LinkHref;
  icon: IoniconName;
  text: string;
};

export default function ProfileLink({ href, icon, text }: ProfileLinkProps) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="bg-secondary gap-4 flex-row items-center w-full p-4 rounded-xl">
          <Ionicons name={icon} size={28} color={COLORS.accent} />
          <Text className="text-white text-lg">{text}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
