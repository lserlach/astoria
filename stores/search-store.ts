import { create } from "zustand";

import type { Hotel, SearchFilters, SortOption, Tour } from "@/lib/api/types";
import { getHotels, getTours } from "@/lib/api";

export function defaultSearchFilters(): SearchFilters {
  return {
  departureCity: "Москва",
  countryOrResort: "Турция",
  nights: 7,
  adults: 2,
  children: 0,
  hotelStars: null,
  hotelType: "Любой",
  mealType: "Любое",
  ratingMin: null,
  charterOnly: false,
  hotOnly: false,
  stars3: false,
  stars4: false,
  stars5: false,
  firstLineHotel: false,
  resorts: [],
  priceMin: null,
  priceMax: null,
  roomAirCon: false,
  roomKitchen: false,
  roomBalcony: false,
  roomWifi: false,
  beachPrivate: false,
  beachSand: false,
  beachPebble: false,
  hotelGuarantee: false,
  advancedBarExpanded: false,
  };
}

interface SearchState {
  tab: "tours" | "hotels";
  sort: SortOption;
  filters: SearchFilters;
  tours: Tour[];
  hotels: Hotel[];
  toursTotal: number;
  hotelsTotal: number;
  loading: boolean;
  setTab: (tab: "tours" | "hotels") => void;
  setSort: (sort: SortOption) => void;
  patchFilters: (patch: Partial<SearchFilters>) => void;
  toggleResort: (name: string) => void;
  runSearch: () => Promise<void>;
  hydrateFromHome: (patch: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  tab: "tours",
  sort: "price_asc",
  filters: defaultSearchFilters(),
  tours: [],
  hotels: [],
  toursTotal: 0,
  hotelsTotal: 0,
  loading: false,
  setTab: (tab) => set({ tab }),
  setSort: (sort) => set({ sort }),
  patchFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  toggleResort: (name) =>
    set((s) => {
      const has = s.filters.resorts.includes(name);
      const resorts = has
        ? s.filters.resorts.filter((r) => r !== name)
        : [...s.filters.resorts, name];
      return { filters: { ...s.filters, resorts } };
    }),
  hydrateFromHome: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: defaultSearchFilters() }),
  runSearch: async () => {
    const { filters, sort } = get();
    set({ loading: true });
    try {
      const [toursRes, hotelsRes] = await Promise.all([
        getTours(filters, sort),
        getHotels(filters, sort),
      ]);
      set({
        tours: toursRes.items,
        hotels: hotelsRes.items,
        toursTotal: toursRes.total,
        hotelsTotal: hotelsRes.total,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
