import type { Metadata } from "next";

import { DirectionsPageView } from "./directions-page-view";

export const metadata: Metadata = {
  title: "Направления — Click Travel",
  description:
    "Популярные страны и курорты. Забронируйте тур за 3 месяца и получите скидку до 30%.",
};

export default function DirectionsPage() {
  return <DirectionsPageView />;
}
