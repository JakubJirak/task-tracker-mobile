import {
  projectsIndexQueryKey,
  projectsShowQueryKey,
} from "@/client/@tanstack/react-query.gen";
import type {
  ProjectResource,
  ProjectsIndexResponse,
  ProjectsShowResponse,
} from "@/client/types.gen";
import { Query, QueryClient } from "@tanstack/react-query";

const isProjectsIndexQuery = (query: Query) =>
  (query.queryKey[0] as { _id?: string } | undefined)?._id === "projectsIndex";

const isProjectsShowQuery = (query: Query) =>
  (query.queryKey[0] as { _id?: string } | undefined)?._id === "projectsShow";

const applyCompletionToProject = (
  project: ProjectResource,
  projectId: number,
  isCompleted: boolean,
): ProjectResource => {
  const shouldUpdateCurrent = project.id === projectId;

  const updatedSubprojects = project.subprojects?.map((subproject) =>
    applyCompletionToProject(subproject, projectId, isCompleted),
  );

  if (!shouldUpdateCurrent && updatedSubprojects === project.subprojects) {
    return project;
  }

  if (!shouldUpdateCurrent) {
    return {
      ...project,
      subprojects: updatedSubprojects,
    };
  }

  return {
    ...project,
    is_completed: isCompleted,
    completed_at: isCompleted
      ? (project.completed_at ?? Math.floor(Date.now() / 1000))
      : null,
    subprojects: updatedSubprojects,
  };
};

const patchProjectsIndexData = (
  data: ProjectsIndexResponse,
  projectId: number,
  isCompleted: boolean,
): ProjectsIndexResponse => {
  let completed = data.completed.map((project) =>
    applyCompletionToProject(project, projectId, isCompleted),
  );
  let uncompleted = data.uncompleted.map((project) =>
    applyCompletionToProject(project, projectId, isCompleted),
  );

  const completedProject = completed.find(
    (project) => project.id === projectId,
  );
  const uncompletedProject = uncompleted.find(
    (project) => project.id === projectId,
  );

  if (isCompleted && uncompletedProject) {
    const moved = {
      ...uncompletedProject,
      is_completed: true,
      completed_at:
        uncompletedProject.completed_at ?? Math.floor(Date.now() / 1000),
    };

    completed = [
      moved,
      ...completed.filter((project) => project.id !== projectId),
    ];
    uncompleted = uncompleted.filter((project) => project.id !== projectId);
  }

  if (!isCompleted && completedProject) {
    const moved = {
      ...completedProject,
      is_completed: false,
      completed_at: null,
    };

    uncompleted = [
      moved,
      ...uncompleted.filter((project) => project.id !== projectId),
    ];
    completed = completed.filter((project) => project.id !== projectId);
  }

  return {
    ...data,
    completed,
    uncompleted,
  };
};

const patchProjectsShowData = (
  data: ProjectsShowResponse,
  projectId: number,
  isCompleted: boolean,
): ProjectsShowResponse => ({
  ...data,
  data: applyCompletionToProject(data.data, projectId, isCompleted),
});

export const syncProjectCompletionInCache = (
  queryClient: QueryClient,
  projectId: number,
  isCompleted: boolean,
) => {
  queryClient.setQueriesData<ProjectsIndexResponse>(
    {
      predicate: isProjectsIndexQuery,
    },
    (oldData) => {
      if (!oldData) {
        return oldData;
      }

      return patchProjectsIndexData(oldData, projectId, isCompleted);
    },
  );

  queryClient.setQueriesData<ProjectsShowResponse>(
    {
      predicate: isProjectsShowQuery,
    },
    (oldData) => {
      if (!oldData) {
        return oldData;
      }

      return patchProjectsShowData(oldData, projectId, isCompleted);
    },
  );
};

export const invalidateProjectQueries = async (
  queryClient: QueryClient,
  projectId: number,
) => {
  await queryClient.invalidateQueries({
    predicate: isProjectsIndexQuery,
  });
  await queryClient.invalidateQueries({
    predicate: isProjectsShowQuery,
  });
  await queryClient.refetchQueries({
    predicate: isProjectsIndexQuery,
    type: "all",
  });

  await queryClient.invalidateQueries({ queryKey: projectsIndexQueryKey() });
  await queryClient.invalidateQueries({
    queryKey: projectsShowQueryKey({ path: { project: projectId } }),
  });
};
