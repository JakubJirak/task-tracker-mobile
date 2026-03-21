import { eventsIndexOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export function useSchool() {
  const query = useQuery({
    ...eventsIndexOptions({ query: { event_type: "school" } }),
    staleTime: 60_000,
  });

  const groupedData = query.data && "before" in query.data ? query.data : null;

  const todaySchool = groupedData?.today ?? [];
  const thisWeekSchool = groupedData?.thisWeek ?? [];
  const nextWeekSchool = groupedData?.nextWeek ?? [];
  const laterSchool = groupedData?.later ?? [];
  const beforeSchool = groupedData?.before ?? [];

  const tws = [...todaySchool, ...thisWeekSchool];

  return {
    ...query,
    allSchool: {
      today: todaySchool,
      thisWeek: thisWeekSchool,
      nextWeek: nextWeekSchool,
      later: laterSchool,
    },
    thisWeekSchool: tws,
    nextWeekSchool,
    laterSchool,
    beforeSchool,
  };
}
