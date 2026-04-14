import type { PromoCardItem, SpecialOfferItem } from "@/lib/api/types";

import { delay } from "@/lib/api-mock/delay";
import { stockTravelImage } from "@/lib/api-mock/stock-image";

const cardImg = (seed: number) => stockTravelImage(seed, 640, 720);

const SPECIAL_OFFER_IMG = {
  so1: "/images/special-offers/special-offer-1.png",
  so2: "/images/special-offers/special-offer-2.png",
  so3: "/images/special-offers/special-offer-3.png",
} as const;

export interface DirectionGeneralInfoRow {
  label: string;
  value: string;
}

export interface DirectionMonthlyPriceRow {
  month: string;
  priceFrom: number;
}

export interface DirectionPriceCta {
  label: string;
  href: string;
}

export interface DirectionCountryPageData {
  slug: string;
  name: string;
  heroImage: string;
  intro: string;
  hotelSectionTitle: string;
  hotels: PromoCardItem[];
  collectionsTitle: string;
  collections: SpecialOfferItem[];
  generalInfoTitle: string;
  generalInfo: DirectionGeneralInfoRow[];
  resortsSectionTitle: string;
  resortsSectionSubtitle: string;
  resortTags: string[];
  monthlyPricesTitle: string;
  monthlyPrices: DirectionMonthlyPriceRow[];
  pricePanelPrimaryCta: DirectionPriceCta;
  pricePanelSecondaryCta: DirectionPriceCta;
  seoTitle: string;
  seoBody: string;
  seoImageSrc?: string;
}

function hotel(
  id: string,
  seed: number,
  hotelName: string,
  locationLabel: string,
  priceFrom: number,
  overrides: Partial<PromoCardItem> = {},
): PromoCardItem {
  return {
    id,
    title: hotelName,
    subtitle: locationLabel,
    priceFrom,
    nights: overrides.nights ?? 7,
    imageUrl: cardImg(seed),
    hotelName,
    rating: overrides.rating ?? 4.8,
    stars: overrides.stars ?? 5,
    locationLabel,
    charter: overrides.charter ?? true,
    roomType: overrides.roomType ?? "Deluxe",
    guestsLabel: overrides.guestsLabel ?? "2 взрослых",
    ...overrides,
  };
}

/** Figma 147:4160 — минимальные цены по месяцам (ориентиры) */
const MONTHLY_PRICES: DirectionMonthlyPriceRow[] = [
  { month: "Январь", priceFrom: 25000 },
  { month: "Февраль", priceFrom: 48000 },
  { month: "Март", priceFrom: 36000 },
  { month: "Апрель", priceFrom: 54000 },
  { month: "Май", priceFrom: 68000 },
  { month: "Июнь", priceFrom: 46000 },
  { month: "Июль", priceFrom: 80000 },
  { month: "Август", priceFrom: 87000 },
  { month: "Сентябрь", priceFrom: 68000 },
  { month: "Октябрь", priceFrom: 56000 },
  { month: "Ноябрь", priceFrom: 40000 },
  { month: "Декабрь", priceFrom: 54000 },
];

function searchTo(country: string) {
  return `/search?to=${encodeURIComponent(country)}`;
}

function collectionsBlock(
  slug: string,
  country: string,
): SpecialOfferItem[] {
  return [
    {
      id: `${slug}-col1`,
      title: "Раннее бронирование",
      description:
        "Забронируйте тур за 3 месяца и получите скидку до 30% на отели-партнёры",
      discountLabel: "-30%",
      scopeLabel: country,
      imageUrl: SPECIAL_OFFER_IMG.so1,
    },
    {
      id: `${slug}-col2`,
      title: "Семейный отдых",
      description:
        "Дети до 12 лет — спецусловия и скидки на размещение в отелях-партнёрах",
      discountLabel: "детям выгодно",
      scopeLabel: country,
      imageUrl: SPECIAL_OFFER_IMG.so2,
    },
    {
      id: `${slug}-col3`,
      title: "Премиум-отели",
      description:
        "Подборка отелей 5* с высоким рейтингом и сервисом all inclusive",
      discountLabel: "5*",
      scopeLabel: country,
      imageUrl: SPECIAL_OFFER_IMG.so3,
    },
    {
      id: `${slug}-col4`,
      title: "Горящие вылеты",
      description:
        "Фиксированные цены при бронировании в течение 48 часов после публикации",
      discountLabel: "горящие",
      scopeLabel: country,
      imageUrl: SPECIAL_OFFER_IMG.so1,
    },
  ];
}

const PAGES: Record<string, DirectionCountryPageData> = {
  turkey: {
    slug: "turkey",
    name: "Турция",
    heroImage: "/directions/turkey.jpg",
    intro: "Популярное направление с пляжами и историей",
    hotelSectionTitle: "Посмотрите туры в эти отели",
    hotels: [
      hotel("dc-tr-1", 41, "Grand Paradise Hotel", "Анталия", 32000, {
        rating: 5,
        stars: 5,
        roomType: "Deluxe Sea View",
        charter: true,
      }),
      hotel("dc-tr-2", 42, "Mediterranean Bay Resort", "Кемер", 28900, {
        rating: 4.7,
        stars: 5,
        roomType: "Standard Garden",
        charter: true,
      }),
      hotel("dc-tr-3", 43, "Side Palace Hotel", "Сиде", 31500, {
        rating: 4.9,
        stars: 5,
        roomType: "Family Suite",
        charter: false,
        guestsLabel: "2 взрослых, 1 ребёнок",
      }),
    ],
    collectionsTitle: "Подборки туров в Турции",
    collections: collectionsBlock("turkey", "Турция"),
    generalInfoTitle: "Общая информация",
    generalInfo: [
      { label: "Сезон отдыха", value: "май — октябрь" },
      { label: "Валюта", value: "турецкая лира (TRY)" },
      { label: "Виза", value: "не требуется для граждан РФ" },
      { label: "Климат", value: "средиземноморский" },
      { label: "Часовой пояс", value: "UTC+3" },
    ],
    resortsSectionTitle: "Популярные курорты",
    resortsSectionSubtitle:
      "Выберите любой из курортов и посмотрите предложенные туры",
    resortTags: ["Анталия", "Белек", "Кемер", "Сиде", "Алания"],
    monthlyPricesTitle: "Цены по месяцам",
    monthlyPrices: MONTHLY_PRICES,
    pricePanelPrimaryCta: {
      label: "Подобрать тур",
      href: searchTo("Турция"),
    },
    pricePanelSecondaryCta: {
      label: "Связаться с менеджером",
      href: "tel:+78000000000",
    },
    seoTitle: "Турция — туры и отели",
    seoBody:
      "Турция остаётся одним из самых востребованных направлений для пляжного отдыха: отели на «всё включено», тёплое море и развитая инфраструктура для семей. На странице направления вы найдёте подборку отелей, ориентиры по ценам по месяцам и популярные курорты — Анталию, Кемер, Сиде и другие. Мы подберём тур с вылетом из вашего города и учтём пожелания по питанию и размещению.",
  },
  egypt: {
    slug: "egypt",
    name: "Египет",
    heroImage: "/directions/egypt.jpg",
    intro: "Круглогодичный отдых на Красном море",
    hotelSectionTitle: "Посмотрите туры в эти отели",
    hotels: [
      hotel("dc-eg-1", 51, "Coral Bay Suites", "Хургада", 35200, {
        rating: 4.8,
        charter: false,
        roomType: "Family Suite",
      }),
      hotel("dc-eg-2", 52, "Nile Horizon Resort", "Шарм-эль-Шейх", 38400, {
        rating: 4.6,
        stars: 4,
        roomType: "Superior Sea View",
      }),
      hotel("dc-eg-3", 53, "Red Sea Pearl", "Хургада", 29800, {
        rating: 4.5,
        stars: 4,
        roomType: "Standard",
      }),
    ],
    collectionsTitle: "Подборки туров в Египте",
    collections: collectionsBlock("egypt", "Египет"),
    generalInfoTitle: "Общая информация",
    generalInfo: [
      { label: "Сезон отдыха", value: "круглый год" },
      { label: "Валюта", value: "египетский фунт (EGP), доллар США" },
      { label: "Виза", value: "e-visa или по прилёте (уточняйте перед вылетом)" },
      { label: "Климат", value: "пустынный, жаркий" },
      { label: "Часовой пояс", value: "UTC+2" },
    ],
    resortsSectionTitle: "Популярные курорты",
    resortsSectionSubtitle:
      "Выберите любой из курортов и посмотрите предложенные туры",
    resortTags: [
      "Хургада",
      "Шарм-эль-Шейх",
      "Марса-Алам",
      "Дахаб",
      "Эль-Гуна",
    ],
    monthlyPricesTitle: "Цены по месяцам",
    monthlyPrices: MONTHLY_PRICES,
    pricePanelPrimaryCta: {
      label: "Подобрать тур",
      href: searchTo("Египет"),
    },
    pricePanelSecondaryCta: {
      label: "Связаться с менеджером",
      href: "tel:+78000000000",
    },
    seoTitle: "Египет — туры и отели",
    seoBody:
      "Египет привлекает круглогодичным купанием в Красном море, отелями с рифами у берега и богатой экскурсионной программой. Хургада и Шарм-эль-Шейх — классика пляжного отдыха; мы поможем подобрать отель по звёздам, питанию и бюджету.",
  },
  uae: {
    slug: "uae",
    name: "ОАЭ",
    heroImage: "/directions/uae.jpg",
    intro: "Роскошный отдых и современные города",
    hotelSectionTitle: "Посмотрите туры в эти отели",
    hotels: [
      hotel("dc-ae-1", 61, "Palm Horizon", "Дубай", 61200, {
        rating: 4.9,
        charter: false,
        roomType: "Superior",
      }),
      hotel("dc-ae-2", 62, "Marina Sky Hotel", "Дубай", 58900, {
        rating: 4.7,
        stars: 5,
        roomType: "Deluxe Marina",
      }),
      hotel("dc-ae-3", 63, "Desert Oasis Resort", "Абу-Даби", 55400, {
        rating: 4.8,
        stars: 5,
        roomType: "Garden Villa",
      }),
    ],
    collectionsTitle: "Подборки туров в ОАЭ",
    collections: collectionsBlock("uae", "ОАЭ"),
    generalInfoTitle: "Общая информация",
    generalInfo: [
      { label: "Сезон отдыха", value: "октябрь — апрель (комфортнее)" },
      { label: "Валюта", value: "дирхам ОАЭ (AED)" },
      {
        label: "Виза",
        value: "безвизовый въезд для граждан РФ (срок уточняйте перед поездкой)",
      },
      { label: "Климат", value: "жаркий, субтропический" },
      { label: "Часовой пояс", value: "UTC+4" },
    ],
    resortsSectionTitle: "Популярные курорты",
    resortsSectionSubtitle:
      "Выберите любой из курортов и посмотрите предложенные туры",
    resortTags: ["Дубай", "Абу-Даби", "Шарджа", "Рас-Эль-Хайма", "Аджман"],
    monthlyPricesTitle: "Цены по месяцам",
    monthlyPrices: MONTHLY_PRICES,
    pricePanelPrimaryCta: {
      label: "Подобрать тур",
      href: searchTo("ОАЭ"),
    },
    pricePanelSecondaryCta: {
      label: "Связаться с менеджером",
      href: "tel:+78000000000",
    },
    seoTitle: "ОАЭ — туры и отели",
    seoBody:
      "ОАЭ сочетают пляжный отдых, шопинг и развлечения мирового уровня: Дубай и Абу-Даби предлагают отели премиум-класса и насыщенную программу на любой вкус. Подберём тур с удобными перелётами и отелем под ваш бюджет.",
  },
  thailand: {
    slug: "thailand",
    name: "Таиланд",
    heroImage: "/directions/thailand.jpg",
    intro: "Экзотика и тропические пляжи",
    hotelSectionTitle: "Посмотрите туры в эти отели",
    hotels: [
      hotel("dc-th-1", 71, "Lagoon Phuket Resort", "Пхукет", 72000, {
        rating: 4.8,
        charter: true,
        roomType: "Bungalow",
      }),
      hotel("dc-th-2", 72, "Bangkok Riverside", "Бангкок", 68000, {
        rating: 4.6,
        charter: false,
        roomType: "Executive",
      }),
      hotel("dc-th-3", 73, "Samui Pearl Villas", "Самуи", 89500, {
        rating: 5,
        stars: 5,
        roomType: "Pool Villa",
      }),
    ],
    collectionsTitle: "Подборки туров в Таиланде",
    collections: collectionsBlock("thailand", "Таиланд"),
    generalInfoTitle: "Общая информация",
    generalInfo: [
      { label: "Сезон отдыха", value: "ноябрь — март (сухой сезон)" },
      { label: "Валюта", value: "бат (THB)" },
      {
        label: "Виза",
        value: "режим въезда уточняйте перед поездкой (правила меняются)",
      },
      { label: "Климат", value: "тропический муссонный" },
      { label: "Часовой пояс", value: "UTC+7" },
    ],
    resortsSectionTitle: "Популярные курорты",
    resortsSectionSubtitle:
      "Выберите любой из курортов и посмотрите предложенные туры",
    resortTags: ["Пхукет", "Паттайя", "Самуи", "Краби", "Бангкок"],
    monthlyPricesTitle: "Цены по месяцам",
    monthlyPrices: MONTHLY_PRICES,
    pricePanelPrimaryCta: {
      label: "Подобрать тур",
      href: searchTo("Таиланд"),
    },
    pricePanelSecondaryCta: {
      label: "Связаться с менеджером",
      href: "tel:+78000000000",
    },
    seoTitle: "Таиланд — туры и отели",
    seoBody:
      "Таиланд — направление для пляжного отдыха, экскурсий и гастрономии: Пхукет и Самуи, Бангкок и Краби. Поможем выбрать отель по питанию, расположению и рейтингу, ориентируясь на сезон и ваш бюджет.",
  },
  maldives: {
    slug: "maldives",
    name: "Мальдивы",
    heroImage: "/directions/maldives.jpg",
    intro: "Райские острова для романтики",
    hotelSectionTitle: "Посмотрите туры в эти отели",
    hotels: [
      hotel("dc-mv-1", 81, "Serenity Maldives Villa", "Мале", 238000, {
        rating: 5,
        stars: 5,
        charter: false,
        roomType: "Water Villa",
      }),
      hotel("dc-mv-2", 82, "Azure Atoll Resort", "Ари", 215000, {
        rating: 4.9,
        stars: 5,
        roomType: "Beach Villa",
      }),
      hotel("dc-mv-3", 83, "Coral Lagoon Suites", "Баа", 198000, {
        rating: 4.8,
        stars: 5,
        roomType: "Lagoon Suite",
      }),
    ],
    collectionsTitle: "Подборки туров на Мальдивах",
    collections: collectionsBlock("maldives", "Мальдивы"),
    generalInfoTitle: "Общая информация",
    generalInfo: [
      { label: "Сезон отдыха", value: "ноябрь — апрель" },
      { label: "Валюта", value: "мальдивская руфия (MVR), часто USD в отелях" },
      { label: "Виза", value: "по прибытии (бесплатно на срок тура, уточняйте)" },
      { label: "Климат", value: "тропический морской" },
      { label: "Часовой пояс", value: "UTC+5" },
    ],
    resortsSectionTitle: "Популярные атоллы и зоны",
    resortsSectionSubtitle:
      "Выберите зону и посмотрите предложенные отели и виллы",
    resortTags: ["Мале", "Ари", "Баа", "Северный Мале", "Южный Мале"],
    monthlyPricesTitle: "Цены по месяцам",
    monthlyPrices: MONTHLY_PRICES,
    pricePanelPrimaryCta: {
      label: "Подобрать тур",
      href: searchTo("Мальдивы"),
    },
    pricePanelSecondaryCta: {
      label: "Связаться с менеджером",
      href: "tel:+78000000000",
    },
    seoTitle: "Мальдивы — туры и отели",
    seoBody:
      "Мальдивы — формат отдыха «один отель — один остров»: виллы на воде, коралловые рифы и высокий сервис. Подберём вариант по перелёту, трансферу на спидботе или гидросамолёте и типу размещения.",
  },
};

export const directionCountrySlugs = Object.keys(PAGES);

export async function getDirectionCountryMock(
  slug: string,
): Promise<DirectionCountryPageData | null> {
  await delay(200);
  return PAGES[slug] ?? null;
}
