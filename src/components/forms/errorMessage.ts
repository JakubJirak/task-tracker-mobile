const readMessage = (error: unknown): string | undefined => {
  if (typeof error === "string") {
    return error;
  }

  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  if (
    "issues" in error &&
    Array.isArray(error.issues) &&
    error.issues.length > 0
  ) {
    return readMessage(error.issues[0]);
  }

  if (
    "errors" in error &&
    Array.isArray(error.errors) &&
    error.errors.length > 0
  ) {
    return readMessage(error.errors[0]);
  }

  return undefined;
};

export const getFirstFieldErrorMessage = (
  errors: unknown[],
  fallback = "Neplatná hodnota",
) => {
  for (const error of errors) {
    const message = readMessage(error);
    if (message) {
      return message;
    }
  }

  return fallback;
};
