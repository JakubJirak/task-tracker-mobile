import { TagResource } from "@/client";
import { tagsIndexOptions } from "@/client/@tanstack/react-query.gen";
import AddTagSheet from "@/components/home/profil/tags/addTagSheet";
import EditTagSheet, {
  EditTagSheetHandle,
} from "@/components/home/profil/tags/editTagSheet";
import TagGroup from "@/components/home/profil/tags/tagGroup";
import TopBar from "@/components/topBar";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function Home() {
  const { data, isLoading } = useQuery({
    ...tagsIndexOptions(),
    staleTime: 60_000,
  });

  const editTagSheet = useRef<EditTagSheetHandle>(null);

  const tags = data as unknown as {
    project: TagResource[];
    reminder: TagResource[];
    task: TagResource[];
    school: TagResource[];
  };

  const handleTagPress = async (tag: TagResource) => {
    await editTagSheet.current?.present({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      tags_type: tag.tags_type,
    });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      <TopBar title="Tagy" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-5 mt-2 pb-30">
          <TagGroup
            title="Projekty"
            icon="folder-outline"
            tags={tags.project}
            onTagPress={handleTagPress}
          />
          <TagGroup
            title="Úkoly"
            icon="list-outline"
            tags={tags.task}
            onTagPress={handleTagPress}
          />
          <TagGroup
            title="Připomínky"
            icon="notifications-outline"
            tags={tags.reminder}
            onTagPress={handleTagPress}
          />
          <TagGroup
            title="Škola"
            icon="school-outline"
            tags={tags.school}
            onTagPress={handleTagPress}
          />
        </View>
      </ScrollView>
      <View className="absolute left-0 right-7 bottom-22">
        <AddTagSheet />
      </View>
      <EditTagSheet ref={editTagSheet} />
    </View>
  );
}
