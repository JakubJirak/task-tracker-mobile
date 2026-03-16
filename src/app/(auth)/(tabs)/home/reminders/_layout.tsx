import AddReminderSheet from "@/components/home/addReminderSheet";
import EventsTopBar from "@/components/home/eventsTopBar";
import { COLORS } from "@/constants/COLORS";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { View } from "react-native";

const MaterialTopTabs = createMaterialTopTabNavigator();

const ExpoRouterMaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabs.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(MaterialTopTabs.Navigator);

export default function RootLayout() {
  return (
    <View className="flex-1">
      <EventsTopBar title="Připomínky" />
      <ExpoRouterMaterialTopTabs
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarStyle: { backgroundColor: COLORS.primary },
          tabBarItemStyle: { paddingHorizontal: 0, paddingVertical: 0 },
          tabBarIndicatorStyle: { backgroundColor: COLORS.tint },
          tabBarActiveTintColor: COLORS.tint,
          tabBarInactiveTintColor: COLORS.muted,
          swipeEnabled: true,
          tabBarLabelStyle: {
            fontSize: 13,
            textTransform: "none",
            fontWeight: "600",
          },
        }}
      >
        <ExpoRouterMaterialTopTabs.Screen
          name="index"
          options={{ title: "Vsechny" }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="this-week"
          options={{ title: "Tento týd." }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="next-week"
          options={{ title: "Příští týd." }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="later"
          options={{ title: "Později" }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="before"
          options={{ title: "Předešlé" }}
        />
      </ExpoRouterMaterialTopTabs>

      <View
        pointerEvents="box-none"
        className="absolute left-0 right-7 bottom-22"
      >
        <AddReminderSheet />
      </View>
    </View>
  );
}
