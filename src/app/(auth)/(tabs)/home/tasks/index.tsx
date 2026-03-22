import TaskLi from "@/components/home/tasks/taskLi";
import { useTasks } from "@/hooks/useTasks";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Home() {
  const { allTasks, isLoading, isError } = useTasks();
  const [animateLayout, setAnimateLayout] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const startToggleLayoutAnimation = () => {
    setAnimateLayout(true);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setAnimateLayout(false);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  if (isError) {
    return (
      <View className="bg-primary relative flex-1 px-3">
        <Text className="text-text mt-3">Nepodařilo se načíst úkoly.</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={allTasks}
      renderItem={({ item }) => (
        <TaskLi
          task={item}
          animateLayout={animateLayout}
          onToggleStart={startToggleLayoutAnimation}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      className="mt-3 px-2"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListEmptyComponent={() => (
        <View>
          <Text className="text-muted mt-3 text-center">
            Žádné nesplněné úkoly.
          </Text>
        </View>
      )}
    />
  );
}
