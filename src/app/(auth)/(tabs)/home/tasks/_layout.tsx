import EventsTopBar from "@/components/home/eventsTopBar";
import { COLORS } from "@/constants/COLORS";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";

const MaterialTopTabs = createMaterialTopTabNavigator();

const ExpoRouterMaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabs.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(MaterialTopTabs.Navigator);

export default function RootLayout() {
  return (
    <>
      <EventsTopBar title="Úkoly" />
      <ExpoRouterMaterialTopTabs
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarStyle: { backgroundColor: COLORS.primary },
          tabBarItemStyle: { paddingHorizontal: 2, paddingVertical: 0 },
          tabBarIndicatorStyle: { backgroundColor: COLORS.tint },
          tabBarActiveTintColor: COLORS.tint,
          tabBarInactiveTintColor: COLORS.muted,
          swipeEnabled: true,
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: "none",
            fontWeight: "600",
          },
        }}
      >
        <ExpoRouterMaterialTopTabs.Screen
          name="index"
          options={{ title: "Nesplněné" }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="no-date"
          options={{ title: "Bez data" }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="date"
          options={{ title: "S datem" }}
        />
        <ExpoRouterMaterialTopTabs.Screen
          name="completed"
          options={{ title: "Splněné" }}
        />
      </ExpoRouterMaterialTopTabs>
    </>
  );
}
