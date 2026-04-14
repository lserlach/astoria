import type { Hotel, SearchFilters } from "@/lib/api/types";

function matchesStars(h: Hotel, f: SearchFilters): boolean {
  const anyStar = f.stars3 || f.stars4 || f.stars5;
  if (!anyStar) return true;
  if (f.stars3 && h.stars === 3) return true;
  if (f.stars4 && h.stars === 4) return true;
  if (f.stars5 && h.stars === 5) return true;
  return false;
}

export function filterHotels(hotels: Hotel[], f: SearchFilters): Hotel[] {
  const q = f.countryOrResort.trim().toLowerCase();
  return hotels.filter((h) => {
    if (q) {
      const hay = `${h.country} ${h.resort} ${h.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.hotelStars != null && h.stars !== f.hotelStars) return false;
    if (f.ratingMin != null && h.rating < f.ratingMin) return false;
    if (f.firstLineHotel && !h.firstLine) return false;
    if (!matchesStars(h, f)) return false;
    if (f.resorts.length > 0 && !f.resorts.includes(h.resort)) return false;
    if (f.priceMin != null && h.priceFrom < f.priceMin) return false;
    if (f.priceMax != null && h.priceFrom > f.priceMax) return false;
    return true;
  });
}
