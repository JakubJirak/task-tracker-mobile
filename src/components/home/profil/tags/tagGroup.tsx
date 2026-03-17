import { TagResource } from "@/client";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import TagLi from "./tagLi";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TagGroup = ({
  title,
  icon,
  tags,
  onTagPress,
}: {
  title: string;
  icon: IoniconName;
  tags: TagResource[];
  onTagPress: (tag: TagResource) => void;
}) => {
  return (
    <View>
      <View className="flex-row gap-2 items-center">
        <Ionicons name={icon} size={20} color="#fff" />
        <Text className="text-lg text-text font-medium">{title}</Text>
      </View>

      <View className="mt-2 gap-2">
        {tags.map((item) => (
          <TagLi
            key={item.id}
            id={item.id}
            name={item.name}
            color={item.color}
            onPress={() => onTagPress(item)}
          />
        ))}
      </View>
    </View>
  );
};

export default TagGroup;
