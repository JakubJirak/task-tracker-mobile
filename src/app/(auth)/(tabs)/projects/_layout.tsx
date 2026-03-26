import AddProjectSheet from "@/components/projects/addProjectSheet";
import EditProjectSheet from "@/components/projects/editProjectSheet";
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
            fontSize: 16,
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

      <EditProjectSheet />

      <View
        pointerEvents="box-none"
        className="absolute left-0 right-7 bottom-22"
      >
        <AddProjectSheet />
      </View>
    </View>
  );
}
