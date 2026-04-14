import type { SearchFilters, Tour } from "@/lib/api/types";

function matchesStars(tour: Tour, f: SearchFilters): boolean {
  const anyStar = f.stars3 || f.stars4 || f.stars5;
  if (!anyStar) return true;
  if (f.stars3 && tour.stars === 3) return true;
  if (f.stars4 && tour.stars === 4) return true;
  if (f.stars5 && tour.stars === 5) return true;
  return false;
}

function matchesMeal(tour: Tour, meal: string): boolean {
  const m = meal.trim().toLowerCase();
  if (!m || m === "любое" || m === "any") return true;
  const t = tour.mealType.toLowerCase();
  if (m === "ai" || m.includes("all inclusive")) return t.includes("ai") || t.includes("all");
  if (m === "bb") return t.includes("bb");
  if (m === "hb") return t.includes("hb");
  if (m === "fb") return t.includes("fb");
  if (m === "uai") return t.includes("uai");
  return t.includes(m);
}

export function filterTours(tours: Tour[], f: SearchFilters): Tour[] {
  const q = f.countryOrResort.trim().toLowerCase();
  return tours.filter((t) => {
    if (q) {
      const hay = `${t.country} ${t.resort} ${t.hotelName}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.hotelStars != null && t.stars !== f.hotelStars) return false;
    if (f.ratingMin != null && t.rating < f.ratingMin) return false;
    if (f.charterOnly && !t.charter) return false;
    if (f.hotOnly && !t.isHot) return false;
    if (!matchesMeal(t, f.mealType)) return false;
    if (!matchesStars(t, f)) return false;
    if (f.resorts.length > 0 && !f.resorts.includes(t.resort)) return false;
    if (f.priceMin != null && t.priceFrom < f.priceMin) return false;
    if (f.priceMax != null && t.priceFrom > f.priceMax) return false;
    return true;
  });
}
