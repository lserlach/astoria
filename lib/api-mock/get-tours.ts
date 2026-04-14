import type { SearchFilters, SortOption, ToursResult } from "@/lib/api/types";
import { delay } from "@/lib/api-mock/delay";
import { filterTours } from "@/lib/api-mock/filter-tours";
import { sortTours } from "@/lib/api-mock/sort";
import { MOCK_TOURS } from "@/lib/api-mock/tours-seed";

export async function getToursMock(
  filters: SearchFilters,
  sort: SortOption,
): Promise<ToursResult> {
  await delay();
  const filtered = filterTours(MOCK_TOURS, filters);
  const items = sortTours(filtered, sort);
  return { items, total: items.length };
}
