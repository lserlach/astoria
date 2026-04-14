export type SortOption = "price_asc" | "price_desc" | "rating_desc" | "date_asc";

export interface Tour {
  id: string;
  hotelName: string;
  rating: number;
  stars: number;
  country: string;
  resort: string;
  locationLabel: string;
  dateLabel: string;
  nights: number;
  mealType: string;
  isHot: boolean;
  charter: boolean;
  roomType: string;
  guestsLabel: string;
  priceFrom: number;
  imageUrl: string;
  /** Extra photos for result-card hover gallery (optional; defaults to `imageUrl` only). */
  galleryImageUrls?: string[];
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  country: string;
  resort: string;
  locationLabel: string;
  mealType: string;
  priceFrom: number;
  imageUrl: string;
  firstLine: boolean;
  /** Optional lead text on result cards (Figma hotel summary card). */
  description?: string;
}

export interface SearchFilters {
  departureCity: string;
  countryOrResort: string;
  nights: number;
  adults: number;
  children: number;
  hotelStars: number | null;
  hotelType: string;
  mealType: string;
  ratingMin: number | null;
  charterOnly: boolean;
  hotOnly: boolean;
  stars3: boolean;
  stars4: boolean;
  stars5: boolean;
  firstLineHotel: boolean;
  resorts: string[];
  priceMin: number | null;
  priceMax: number | null;
  /** In-room amenities (mock: stored, not yet applied in filter pipeline). */
  roomAirCon: boolean;
  roomKitchen: boolean;
  roomBalcony: boolean;
  roomWifi: boolean;
  /** Beach / location extras (mock). */
  beachPrivate: boolean;
  beachSand: boolean;
  beachPebble: boolean;
  /** Hotel room guarantee (mock). */
  hotelGuarantee: boolean;
  /** Show «В номере», «Пляж», «Туроператоры», «Бюджет» rows in search details bar. */
  advancedBarExpanded: boolean;
}

export interface PromoCardItem {
  id: string;
  title: string;
  subtitle: string;
  priceFrom: number;
  nights: number;
  imageUrl: string;
  badge?: string;
  /** Figma home card (358:30539) — optional rich fields */
  hotelName?: string;
  rating?: number;
  stars?: number;
  locationLabel?: string;
  dateLabel?: string;
  mealType?: string;
  charter?: boolean;
  roomType?: string;
  guestsLabel?: string;
}

/** Figma 322:13568 — «Спецпредложения» card */
export interface SpecialOfferItem {
  id: string;
  title: string;
  /** Main promo copy under the title */
  description: string;
  imageUrl: string;
  /** Pill on the right, e.g. "-30%" */
  discountLabel?: string;
  /** Map pin row, e.g. "Все направления" */
  scopeLabel?: string;
  /** CTA text; default "подробнее" in UI */
  ctaLabel?: string;
}

/** Figma 322:13592 — review card (trip location + date in footer) */
export interface ReviewItem {
  id: string;
  author: string;
  text: string;
  rating: number;
  /** Trip destination line, e.g. "Турция, Анталия" */
  locationLabel: string;
  /** Display date, e.g. "Октябрь 2024" */
  date: string;
}

/** Figma 322:13572 — advantage row icons (Phosphor) */
export type AdvantageIconId =
  | "headset"
  | "creditCard"
  | "thumbsUp"
  | "handHeart"
  | "users"
  | "globe"
  | "medal"
  | "trendUp";

export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  icon: AdvantageIconId;
}

/** Figma 322:13542 — «Минимальные цены по направлениям» */
export interface DirectionPriceItem {
  id: string;
  name: string;
  priceFrom: number;
  imageUrl: string;
}

export interface HomeContent {
  hotTours: PromoCardItem[];
  hotelSpotlight: PromoCardItem[];
  specialOffers: SpecialOfferItem[];
  directionPrices: DirectionPriceItem[];
  advantages: AdvantageItem[];
  reviews: ReviewItem[];
}

export interface ToursResult {
  items: Tour[];
  total: number;
}

/** Phosphor icon id for tour detail section headers (Figma 281:9980). */
export type TourDetailSectionIcon =
  | "info"
  | "heart"
  | "airplane"
  | "waves"
  | "building"
  | "dresser"
  | "towel"
  | "bell"
  | "baby"
  | "forkknife"
  | "handheart"
  | "map";

export interface TourFlightLegData {
  mode: "outbound" | "return";
  airlineName: string;
  depFlightNo: string;
  depAirport: string;
  depTimeLabel: string;
  arrFlightNo: string;
  arrAirport: string;
  arrTimeLabel: string;
}

export type TourDetailSection =
  | {
      type: "text";
      title: string;
      icon: TourDetailSectionIcon;
      paragraphs: string[];
    }
  | {
      type: "bullets";
      title: string;
      icon: TourDetailSectionIcon;
      items: string[];
    }
  | { type: "flights"; legs: TourFlightLegData[] }
  | {
      type: "kv";
      title: string;
      icon: TourDetailSectionIcon;
      rows: { label: string; value: string }[];
    }
  | {
      type: "meal";
      title: string;
      icon: TourDetailSectionIcon;
      intro: { typeLabel: string; name: string; description: string };
      groups: { heading: string; items: string[] }[];
    }
  | {
      type: "checks";
      title: string;
      icon: TourDetailSectionIcon;
      items: string[];
    }
  | { type: "map"; title: string; query: string }
  | { type: "notice"; message: string };

/** Full payload for `/tour/[id]` (mock). */
export interface TourDetailPageData {
  tour: Tour;
  /** Breadcrumb + hotel card location line */
  locationLine: string;
  guaranteeHotel: boolean;
  tourPriceRub: number;
  fuelSurchargeRub: number;
  bookFromRub: number;
  sidebarIncluded: string[];
  flightsColumn: TourFlightLegData[];
  sections: TourDetailSection[];
}

export interface HotelsResult {
  items: Hotel[];
  total: number;
}
