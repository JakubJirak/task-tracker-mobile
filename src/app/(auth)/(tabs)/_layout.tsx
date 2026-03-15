import { COLORS } from "@/constants/COLORS";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function RootLayout() {
  return (
    <NativeTabs
      backgroundColor={COLORS.sheet}
      indicatorColor="#211347"
      rippleColor="#663dd4"
      tintColor={COLORS.tint}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Domů</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home" sf="house" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>Kalendář</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="calendar_today" sf="calendar" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="projects">
        <NativeTabs.Trigger.Label>Projekty</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="folder" sf="folder" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
