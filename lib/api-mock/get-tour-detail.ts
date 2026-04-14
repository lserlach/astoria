import type {
  Tour,
  TourDetailPageData,
  TourDetailSection,
  TourFlightLegData,
} from "@/lib/api/types";

import { GRAND_PARADISE_PAGE_DETAIL } from "@/lib/api-mock/tour-detail-t1";
import { MOCK_TOURS } from "@/lib/api-mock/tours-seed";

function galleryList(tour: Tour): string[] {
  const raw = [tour.imageUrl, ...(tour.galleryImageUrls ?? [])];
  const uniq: string[] = [];
  for (const u of raw) {
    if (!uniq.includes(u)) uniq.push(u);
  }
  while (uniq.length < 6) {
    uniq.push(raw[uniq.length % raw.length]);
  }
  return uniq.slice(0, 6);
}

function fallbackFlights(tour: Tour): TourFlightLegData[] {
  const charter = tour.charter ? "Чартерный перелёт" : "Регулярный перелёт";
  return [
    {
      mode: "outbound",
      airlineName: charter,
      depFlightNo: "Рейс уточняется",
      depAirport: "Москва",
      depTimeLabel: tour.dateLabel,
      arrFlightNo: "",
      arrAirport: `${tour.country}, ${tour.resort}`,
      arrTimeLabel: "По расписанию",
    },
    {
      mode: "return",
      airlineName: charter,
      depFlightNo: "Рейс уточняется",
      depAirport: `${tour.country}, ${tour.resort}`,
      depTimeLabel: "По расписанию",
      arrFlightNo: "",
      arrAirport: "Москва",
      arrTimeLabel: tour.dateLabel,
    },
  ];
}

function fallbackSections(tour: Tour): TourDetailSection[] {
  return [
    {
      type: "text",
      title: "Общая информация",
      icon: "info",
      paragraphs: [
        `${tour.hotelName} — ${tour.stars}★, рейтинг ${tour.rating.toFixed(1)}. ${tour.locationLabel}.`,
        `Проживание: ${tour.roomType}. Питание: ${tour.mealType}. ${tour.guestsLabel}.`,
        "Точные условия заезда, перелёта и отеля уточняйте у менеджера перед бронированием.",
      ],
    },
    {
      type: "checks",
      title: "Что включено в тур",
      icon: "heart",
      items: [
        "Перелёт туда и обратно (по выбранному тарифу)",
        "Трансфер аэропорт — отель — аэропорт",
        `Проживание ${tour.nights} ночей`,
        `Питание: ${tour.mealType}`,
        "Базовая медицинская страховка",
      ],
    },
    { type: "flights", legs: fallbackFlights(tour) },
    {
      type: "map",
      title: "Расположение на карте",
      query: `${tour.hotelName} ${tour.locationLabel}`,
    },
    {
      type: "notice",
      message:
        "Информация носит справочный характер. Актуальные цены и наличие мест зависят от даты запроса.",
    },
  ];
}

function buildFallbackDetail(tour: Tour): TourDetailPageData {
  const flights = fallbackFlights(tour);
  const basePrice = Math.round(tour.priceFrom * 2.6);
  const fuel = Math.round(tour.priceFrom * 0.18);
  const included = [
    `Авиаперелёт (вариант: ${tour.charter ? "чартер" : "регуляр"})`,
    "Трансфер аэропорт — отель — аэропорт",
    `Проживание ${tour.nights} ночей`,
    `Питание: ${tour.mealType}`,
    "Медицинская страховка",
  ];
  return {
    tour,
    locationLine: tour.locationLabel,
    guaranteeHotel: false,
    tourPriceRub: basePrice,
    fuelSurchargeRub: fuel,
    bookFromRub: tour.priceFrom,
    sidebarIncluded: included,
    flightsColumn: flights,
    sections: fallbackSections(tour),
  };
}

/** Merge gallery order into tour for page hero (first = main). */
function withGalleryFront(tour: Tour): Tour {
  const g = galleryList(tour);
  return {
    ...tour,
    imageUrl: g[0],
    galleryImageUrls: g.slice(1),
  };
}

export async function getTourDetailById(id: string): Promise<TourDetailPageData | null> {
  const base = MOCK_TOURS.find((t) => t.id === id);
  if (!base) return null;

  const tour = withGalleryFront(base);

  if (id === "t1") {
    return {
      tour,
      ...GRAND_PARADISE_PAGE_DETAIL,
    };
  }

  return buildFallbackDetail(tour);
}

export function getAllTourIds(): string[] {
  return MOCK_TOURS.map((t) => t.id);
}
