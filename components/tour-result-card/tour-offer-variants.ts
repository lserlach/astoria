import type { Tour } from "@/lib/api/types";

export interface TourOfferRow {
  id: string;
  dateLine: string;
  flightLabel: string;
  guestsLine: string;
  mealLine: string;
  roomSpecLine: string;
  priceRub: number;
}

export interface TourRoomSection {
  id: string;
  title: string;
  headerPriceRub: number;
  imageUrl: string;
  offers: TourOfferRow[];
}

function formatDateLine(tour: Tour): string {
  const m = tour.dateLabel.match(/^(.+?)\s*•\s*(\d+)/);
  if (m) {
    return `${m[1].trim()} / ${m[2]} нч`;
  }
  const head = tour.dateLabel.replace(/\s*•.*$/u, "").trim();
  return `${head} / ${tour.nights} нч`;
}

function altDateLine(tour: Tour): string {
  return `27 апреля / ${tour.nights + 3} нч`;
}

function formatMealLine(meal: string): string {
  if (/all\s*inclusive|всё\s*включено|все\s*включено|\bai\b|uai|ultra/i.test(meal)) {
    return "AI - Все Включено";
  }
  return meal;
}

/** Room accordion + offer table rows (Figma 216:18690). */
export function buildTourRoomSections(tour: Tour): TourRoomSection[] {
  const dateLine = formatDateLine(tour);
  const flightLabel = tour.charter ? "Чартерный рейс" : "Регулярный рейс";
  const mealLine = formatMealLine(tour.mealType);
  const guestsLine = tour.guestsLabel;

  const roomSpec =
    "Standard / 23 м2, 1 комната, 1 спальня";

  const standardOffers: TourOfferRow[] = [0, 1, 2].map((i) => ({
    id: `${tour.id}-std-offer-${i}`,
    dateLine: i === 2 ? altDateLine(tour) : dateLine,
    flightLabel,
    guestsLine,
    mealLine,
    roomSpecLine: roomSpec,
    priceRub: Math.round(tour.priceFrom * (2.55 + i * 0.35)),
  }));

  const headerPrice = Math.round(tour.priceFrom * 2.2);

  return [
    {
      id: `${tour.id}-room-one`,
      title: "One room",
      headerPriceRub: headerPrice,
      imageUrl: tour.imageUrl,
      offers: [],
    },
    {
      id: `${tour.id}-room-standard`,
      title: "Standard",
      headerPriceRub: headerPrice,
      imageUrl: tour.galleryImageUrls?.[0] ?? tour.imageUrl,
      offers: standardOffers,
    },
  ];
}
