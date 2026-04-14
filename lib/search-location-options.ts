export interface SearchLocationOption {
  value: string;
  label: string;
  flag?: string;
}

export const CITY_OPTIONS: SearchLocationOption[] = [
  { value: "Москва", label: "Москва", flag: "🇷🇺" },
  { value: "Санкт-Петербург", label: "Санкт-Петербург", flag: "🇷🇺" },
  { value: "Казань", label: "Казань", flag: "🇷🇺" },
  { value: "Екатеринбург", label: "Екатеринбург", flag: "🇷🇺" },
];

export const DESTINATION_OPTIONS: SearchLocationOption[] = [
  { value: "Турция", label: "Турция", flag: "🇹🇷" },
  { value: "Египет", label: "Египет", flag: "🇪🇬" },
  { value: "Греция", label: "Греция", flag: "🇬🇷" },
  { value: "ОАЭ", label: "ОАЭ", flag: "🇦🇪" },
  { value: "Мальдивы", label: "Мальдивы", flag: "🇲🇻" },
  { value: "Таиланд", label: "Таиланд", flag: "🇹🇭" },
  { value: "Италия", label: "Италия", flag: "🇮🇹" },
];
