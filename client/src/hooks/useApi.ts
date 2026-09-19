import { useQuery } from '@tanstack/react-query';

export function useApi<T>(url: string) {
  return useQuery<T>({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    },
  });
}
