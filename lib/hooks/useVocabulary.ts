import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchVocabulary } from "@/lib/services/api";
import { Vocabulary } from "@/types";

type QueryOptions = Omit<
  UseQueryOptions<Vocabulary[], Error>,
  "queryKey" | "queryFn"
>;

export const useVocabulary = (
  chapterId: string | undefined,
  options?: QueryOptions,
): UseQueryResult<Vocabulary[], Error> => {
  const { enabled, ...rest } = options ?? {};
  const isEnabled = Boolean(chapterId) && (enabled ?? true);

  return useQuery<Vocabulary[], Error>({
    queryKey: ["vocabulary", chapterId],
    queryFn: () => fetchVocabulary(chapterId as string),
    enabled: isEnabled,
    ...rest,
  });
};
