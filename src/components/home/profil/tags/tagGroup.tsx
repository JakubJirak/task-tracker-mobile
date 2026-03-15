import { TagResource } from "@/client";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import TagLi from "./tagLi";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TagGroup = ({
  title,
  icon,
  tags,
}: {
  title: string;
  icon: IoniconName;
  tags: TagResource[];
}) => {
  return (
    <View>
      <View className="flex-row gap-2 items-center">
        <Ionicons name={icon} size={20} color="#fff" />
        <Text className="text-lg text-text font-medium">{title}</Text>
      </View>

      <View className="mt-2 flex-row flex-wrap">
        {tags.map((item) => (
          <View key={item.id} className="mr-2 mb-2">
            <TagLi name={item.name} color={item.color} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagGroup;
