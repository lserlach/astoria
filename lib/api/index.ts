import type { SearchFilters, SortOption } from "@/lib/api/types";
import { getHomeContentMock } from "@/lib/api-mock/get-home";
import { getHotelsMock } from "@/lib/api-mock/get-hotels";
import { getTourDetailById, getAllTourIds } from "@/lib/api-mock/get-tour-detail";
import { getToursMock } from "@/lib/api-mock/get-tours";

export type {
  AdvantageIconId,
  AdvantageItem,
  DirectionPriceItem,
  HomeContent,
  Hotel,
  HotelsResult,
  PromoCardItem,
  ReviewItem,
  SearchFilters,
  SortOption,
  SpecialOfferItem,
  Tour,
  TourDetailPageData,
  ToursResult,
} from "@/lib/api/types";

export { getAllTourIds, getHomeContentMock, getHotelsMock, getTourDetailById, getToursMock };

export async function getHomeContent() {
  return getHomeContentMock();
}

export async function getTours(filters: SearchFilters, sort: SortOption) {
  return getToursMock(filters, sort);
}

export async function getHotels(filters: SearchFilters, sort: SortOption) {
  return getHotelsMock(filters, sort);
}

export async function getTourDetail(id: string) {
  return getTourDetailById(id);
}
