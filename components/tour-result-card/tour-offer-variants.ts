import type { Tour } from "@/lib/api/types";

export interface TourOfferVariant {
  id: string;
  dateRangeLabel: string;
  roomLabel: string;
  nightsLabel: string;
  mealLabel: string;
  priceRub: number;
}

const ROOM_LABELS = [
  "Standard garden view",
  "Superior sea view",
  "Family suite",
  "Deluxe panoramic",
  "Club room",
];

function travelDateRangeLabel(tour: Tour): string {
  const trimmed = tour.dateLabel.replace(/\s*•\s*\d+\s*ночей\s*$/i, "").trim();
  if (trimmed) {
    return `${trimmed} • 28 дек`;
  }
  return tour.dateLabel;
}

/** Demo offers under «подробнее» (until API returns real variants). */
export function buildTourOfferVariants(tour: Tour): TourOfferVariant[] {
  return ROOM_LABELS.map((roomLabel, i) => ({
    id: `${tour.id}-offer-${i}`,
    dateRangeLabel: travelDateRangeLabel(tour),
    roomLabel,
    nightsLabel: `${tour.nights} ночей`,
    mealLabel: tour.mealType,
    priceRub: Math.round(tour.priceFrom * (2.6 + i * 0.32)),
  }));
}
