import Tag from "@/components/tag";
import { COLORS } from "@/constants/COLORS";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { project, isLoading, isError } = useProjectContext();

  const formatDate = (date: string | number | null) => {
    if (date === null) {
      return "-";
    }

    if (typeof date === "number") {
      const timestamp = date < 1_000_000_000_000 ? date * 1000 : date;
      const parsedDate = new Date(timestamp);

      return Number.isNaN(parsedDate.getTime())
        ? "-"
        : format(parsedDate, "d. MMMM yyyy", { locale: cs });
    }

    const parsedDate = parseISO(date);
    return Number.isNaN(parsedDate.getTime())
      ? date
      : format(parsedDate, "d. MMMM yyyy", { locale: cs });
  };

  if (isLoading || project === undefined) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst projekt.</Text>
      </View>
    );
  }

  return (
    <View className="px-3 relative">
      <View>
        <View className="flex-row">
          <View className="">
            <View className="flex-row gap-1.5 items-center mt-4">
              <Ionicons
                name="calendar-outline"
                size={16}
                color={COLORS.muted}
              />
              <Text className="text-text text-sm">
                Vytvořeno: {formatDate(project?.data.created_at)}
              </Text>
            </View>
            {project?.data.completed_at && (
              <View className="flex-row gap-1.5 items-center mt-2">
                <Ionicons
                  name="calendar-number-outline"
                  size={16}
                  color={COLORS.muted}
                />
                <Text className="text-text text-sm ">
                  Dokončeno: {formatDate(project.data.completed_at)}
                </Text>
              </View>
            )}
          </View>
          <View className="mt-3 ml-auto mr-2">
            {project?.data.tag && <Tag tag={project?.data.tag} />}
          </View>
        </View>

        <Text className="text-muted mt-3">{project?.data.description}</Text>
      </View>
    </View>
  );
}
