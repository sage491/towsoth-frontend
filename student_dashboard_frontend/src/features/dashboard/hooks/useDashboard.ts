import { useQuery } from "@tanstack/react-query";
import { getDashboardMessages, getDashboardWorkspaces } from "@/features/dashboard/services";

interface UseDashboardDataArgs {
  showRank: boolean;
  focusMode: boolean;
}

export function useDashboardData({ showRank, focusMode }: UseDashboardDataArgs) {
  const messages = useQuery({
    queryKey: ["dashboard", "messages"],
    queryFn: () => Promise.resolve(getDashboardMessages()),
  });

  const workspaces = useQuery({
    queryKey: ["dashboard", "workspaces", showRank, focusMode],
    queryFn: () => Promise.resolve(getDashboardWorkspaces({ showRank, focusMode })),
  });

  return { messages, workspaces };
}
