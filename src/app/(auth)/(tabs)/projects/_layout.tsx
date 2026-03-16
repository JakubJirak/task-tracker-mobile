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
    <ExpoRouterMaterialTopTabs
      screenOptions={{
        lazy: true,
        lazyPreloadDistance: 1,
        tabBarStyle: { backgroundColor: COLORS.primary },
        tabBarIndicatorStyle: { backgroundColor: COLORS.tint },
        tabBarActiveTintColor: COLORS.tint,
        tabBarInactiveTintColor: COLORS.muted,
        swipeEnabled: true,
        tabBarLabelStyle: {
          fontSize: 18,
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
        name="completed"
        options={{ title: "Splněné" }}
      />
    </ExpoRouterMaterialTopTabs>
  );
}
