import type { HotelsResult, SearchFilters, SortOption } from "@/lib/api/types";
import { delay } from "@/lib/api-mock/delay";
import { filterHotels } from "@/lib/api-mock/filter-hotels";
import { sortHotels } from "@/lib/api-mock/sort";
import { MOCK_HOTELS } from "@/lib/api-mock/hotels-seed";

export async function getHotelsMock(
  filters: SearchFilters,
  sort: SortOption,
): Promise<HotelsResult> {
  await delay();
  const filtered = filterHotels(MOCK_HOTELS, filters);
  const items = sortHotels(filtered, sort);
  return { items, total: items.length };
}
