import { notFound } from "next/navigation";

import { DirectionCountryPageView } from "./direction-country-page-view";
import {
  directionCountrySlugs,
  getDirectionCountryMock,
} from "@/lib/api-mock/get-direction-country";

interface DirectionCountryRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return directionCountrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DirectionCountryRouteProps) {
  const { slug } = await params;
  const data = await getDirectionCountryMock(slug);
  if (!data) {
    return { title: "Направление — Click Travel" };
  }
  return {
    title: `${data.seoTitle} — Click Travel`,
    description: `${data.intro} Подборка отелей и туров в ${data.name}.`,
  };
}

export default async function DirectionCountryPage({ params }: DirectionCountryRouteProps) {
  const { slug } = await params;
  const data = await getDirectionCountryMock(slug);
  if (!data) {
    notFound();
  }
  return <DirectionCountryPageView data={data} />;
}
