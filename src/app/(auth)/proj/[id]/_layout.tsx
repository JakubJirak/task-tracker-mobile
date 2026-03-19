import { projectsShowOptions } from "@/client/@tanstack/react-query.gen";
import TopBar from "@/components/topBar";
import { COLORS } from "@/constants/COLORS";
import ProjectContext from "@/contexts/ProjectContext";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { View } from "react-native";

const MaterialTopTabs = createMaterialTopTabNavigator();

const ExpoRouterMaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabs.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(MaterialTopTabs.Navigator);

export default function RootLayout() {
  const { id } = useLocalSearchParams();
  const projectId = Number(Array.isArray(id) ? id[0] : id);

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    ...projectsShowOptions({ path: { project: projectId } }),
    enabled: Number.isFinite(projectId),
  });

  return (
    <ProjectContext.Provider
      value={{
        projectId: projectId,
        project,
        isLoading,
        isError,
      }}
    >
      <View className="flex-1 bg-primary">
        <View className="px-3 -mb-4">
          <TopBar title={project?.data.title ?? "Projekt"} />
        </View>

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
            options={{ title: "Souhrn" }}
          />
          <ExpoRouterMaterialTopTabs.Screen
            name="subproject"
            options={{ title: "Podprojekty" }}
          />
          <ExpoRouterMaterialTopTabs.Screen
            name="tasks"
            options={{ title: "Úkoly" }}
          />
        </ExpoRouterMaterialTopTabs>
      </View>
    </ProjectContext.Provider>
  );
}
