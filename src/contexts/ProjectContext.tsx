import type { ProjectsShowResponse } from "@/client/types.gen";
import { createContext, useContext } from "react";

type ProjectContextValue = {
  projectId: number | null;
  project: ProjectsShowResponse | undefined;
  isLoading: boolean;
  isError: boolean;
};

const ProjectContext = createContext<ProjectContextValue>({
  projectId: null,
  project: undefined,
  isLoading: false,
  isError: false,
});

export function useProjectContext() {
  return useContext(ProjectContext);
}

export default ProjectContext;
