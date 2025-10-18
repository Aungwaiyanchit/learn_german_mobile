import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { fetchChapters } from "@/services/api";
import { Chapter } from "@/types";

type QueryOptions = Omit<
  UseQueryOptions<Chapter[], Error>,
  "queryKey" | "queryFn"
>;

export const useChapters = (
  options?: QueryOptions,
): UseQueryResult<Chapter[], Error> => {
  const { enabled, ...rest } = options ?? {};

  return useQuery<Chapter[], Error>({
    queryKey: ["chapters"],
    queryFn: fetchChapters,
    enabled: enabled ?? true,
    ...rest,
  });
};
