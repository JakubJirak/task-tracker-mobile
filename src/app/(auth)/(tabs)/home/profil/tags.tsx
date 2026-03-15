import { TagResource } from "@/client";
import { tagsIndexOptions } from "@/client/@tanstack/react-query.gen";
import AddTagSheet from "@/components/home/profil/tags/addTagSheet";
import TagGroup from "@/components/home/profil/tags/tagGroup";
import TopBar from "@/components/topBar";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

export default function Home() {
  const { data, isLoading } = useQuery({
    ...tagsIndexOptions(),
  });

  const tags = data as unknown as {
    project: TagResource[];
    reminder: TagResource[];
    task: TagResource[];
    school: TagResource[];
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="bg-primary relative flex-1 px-3">
      <TopBar title="Tagy" />
      <View className="gap-5 mt-2">
        <TagGroup title="Projekty" icon="folder-outline" tags={tags.project} />
        <TagGroup title="Úkoly" icon="list-outline" tags={tags.task} />
        <TagGroup
          title="Připomínky"
          icon="notifications-outline"
          tags={tags.reminder}
        />
        <TagGroup title="Škola" icon="school-outline" tags={tags.school} />
      </View>
      <View className="absolute left-0 right-7 bottom-22">
        <AddTagSheet />
      </View>
    </View>
  );
}
