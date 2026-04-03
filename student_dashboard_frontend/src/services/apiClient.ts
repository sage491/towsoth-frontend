export async function apiRequest<T>(_endpoint: string, _options?: RequestInit): Promise<T> {
  // Future backend integration point.
  // Example:
  // const response = await fetch(`/api${endpoint}`, options);
  // return (await response.json()) as T;
  throw new Error("API client is not connected yet.");
}
