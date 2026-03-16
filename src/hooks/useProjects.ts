import { projectsIndexOptions } from "@/client/@tanstack/react-query.gen";
import type {
  ProjectResource,
  ProjectsIndexResponse,
} from "@/client/types.gen";
import { useQuery } from "@tanstack/react-query";

export function useProjects() {
  const query = useQuery({
    ...projectsIndexOptions(),
    staleTime: 60_000,
  });

  const data = query.data as ProjectsIndexResponse | undefined;

  return {
    ...query,
    completedProjects: (data?.completed ?? []) as ProjectResource[],
    uncompletedProjects: (data?.uncompleted ?? []) as ProjectResource[],
  };
}
