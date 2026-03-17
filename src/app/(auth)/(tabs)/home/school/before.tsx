import SchoolLi from "@/components/home/school/schoolLi";
import { useSchool } from "@/hooks/useSchool";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native";

export default function SchoolBefore() {
  const { beforeSchool, isLoading, isError } = useSchool();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#b69cff" />;
  }

  return (
    <FlashList
      data={beforeSchool}
      renderItem={({ item }) => <SchoolLi school={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="mt-1 px-2"
    />
  );
}
