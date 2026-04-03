import { useQuery } from "@tanstack/react-query";
import { getRecentTestResults } from "@/features/tests/services";

export function useRecentTests() {
  return useQuery({
    queryKey: ["tests", "recent-results"],
    queryFn: getRecentTestResults,
    staleTime: 60_000,
  });
}
