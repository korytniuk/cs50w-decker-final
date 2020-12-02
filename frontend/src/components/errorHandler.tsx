function handleError(toast: any, message: string) {
  toast({
    title: "Error",
    description: message,
    status: "error",
    duration: 4000,
    isClosable: true,
  });
}

function addServerErrors<T>(
  errors: { [P in keyof T]?: string[] },
  setError: (
    name: string,
    error: { type: string; message: string }
  ) => void
) {
  return Object.keys(errors).forEach((key: string) => {
    setError(key, {
      type: "server",
      message: errors[key as keyof T]!.join(
        ". "
      ),
    });
  });
}

export { handleError, addServerErrors };
