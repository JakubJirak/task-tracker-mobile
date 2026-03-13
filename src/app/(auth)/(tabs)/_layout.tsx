import { COLORS } from "@/constants/COLORS";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function RootLayout() {
  return (
    <NativeTabs
      backgroundColor={COLORS.primary}
      indicatorColor={COLORS.accent}
      rippleColor={COLORS.accent}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Domů</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home_filled" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>Kalendář</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="calendar_today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="projects">
        <NativeTabs.Trigger.Label>Projekty</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="folder" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
