import { eventsIndexOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export function useReminders() {
  const query = useQuery({
    ...eventsIndexOptions({ query: { event_type: "reminder" } }),
    staleTime: 60_000,
  });

  const groupedData = query.data && "before" in query.data ? query.data : null;

  const todayReminders = groupedData?.today ?? [];
  const thisWeekReminders = groupedData?.thisWeek ?? [];
  const nextWeekReminders = groupedData?.nextWeek ?? [];
  const laterReminders = groupedData?.later ?? [];
  const beforeReminders = groupedData?.before ?? [];

  const twr = [...todayReminders, ...thisWeekReminders];

  return {
    ...query,
    allReminders: {
      today: todayReminders,
      thisWeek: thisWeekReminders,
      nextWeek: nextWeekReminders,
      later: laterReminders,
    },
    thisWeekReminders: twr,
    nextWeekReminders,
    laterReminders,
    beforeReminders,
  };
}
