/** Thresholds aligned with search filters (Figma rating pills). */
export type RatingBadgeTierKey = "45" | "4" | "35" | "3";

export function ratingToBadgeTierKey(rating: number): RatingBadgeTierKey {
  if (rating >= 4.5) return "45";
  if (rating >= 4) return "4";
  if (rating >= 3.5) return "35";
  return "3";
}
