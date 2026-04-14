import type { Hotel, SortOption, Tour } from "@/lib/api/types";

export function sortTours(items: Tour[], sort: SortOption): Tour[] {
  const copy = [...items];
  copy.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.priceFrom - b.priceFrom;
      case "price_desc":
        return b.priceFrom - a.priceFrom;
      case "rating_desc":
        return b.rating - a.rating;
      case "date_asc":
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });
  return copy;
}

export function sortHotels(items: Hotel[], sort: SortOption): Hotel[] {
  const copy = [...items];
  copy.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.priceFrom - b.priceFrom;
      case "price_desc":
        return b.priceFrom - a.priceFrom;
      case "rating_desc":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });
  return copy;
}
