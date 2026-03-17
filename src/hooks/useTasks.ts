import { tasksIndexOptions } from "@/client/@tanstack/react-query.gen";
import type { TaskResource } from "@/client/types.gen";
import { useQuery } from "@tanstack/react-query";

export function useTasks() {
  const query = useQuery({
    ...tasksIndexOptions(),
    staleTime: 60_000,
  });

  const noDateTasks = (query.data?.nonCompletedNoDate ?? []) as TaskResource[];
  const dateTasks = (query.data?.nonCompletedWithDate ?? []) as TaskResource[];
  const doneTasks = (query.data?.completed ?? []) as TaskResource[];
  const allTasks = [...noDateTasks, ...dateTasks];

  return {
    ...query,
    allTasks,
    nonCompletedNoDateTasks: noDateTasks,
    nonCompletedWithDateTasks: dateTasks,
    doneTasks,
  };
}
