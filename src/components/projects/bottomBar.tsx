import AddSubprojectSheet from "@/components/projects/addSubprojectSheet";
import AddTaskToProjectSheet from "@/components/projects/addTaskToProjectSheet";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function BottomBar() {
  return (
    <>
      <View className="bg-sheet h-23.75 flex-row px-3 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => TrueSheet.present("addSubproject")}
          activeOpacity={0.75}
          className="flex-1 items-center justify-center"
        >
          <MaterialDesignIcons name="folder-plus" size={24} color="#ece6f0" />
          <Text className="text-text mt-1.5 text-xs">Podprojekt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => TrueSheet.present("addTaskToProject")}
          activeOpacity={0.75}
          className="flex-1 items-center justify-center"
        >
          <MaterialDesignIcons
            name="clipboard-plus-outline"
            size={24}
            color="#ece6f0"
          />
          <Text className="text-text mt-1.5 text-xs">Úkol</Text>
        </TouchableOpacity>
      </View>

      <AddSubprojectSheet />
      <AddTaskToProjectSheet />
    </>
  );
}
