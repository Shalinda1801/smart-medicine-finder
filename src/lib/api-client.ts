export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure;

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },

    credentials: "include",
  });

  const body =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    if (!body.success) {
      throw new Error(
        body.error.message ||
          "Something went wrong.",
      );
    }

    throw new Error(
      "Something went wrong.",
    );
  }

  return body.data;
}