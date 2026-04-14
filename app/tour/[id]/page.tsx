import { notFound } from "next/navigation";

import { TourPageView } from "@/components/tour-page/tour-page-view";
import { getAllTourIds, getTourDetail } from "@/lib/api";

interface TourPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllTourIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: TourPageProps) {
  const { id } = await params;
  const data = await getTourDetail(id);
  if (!data) {
    return { title: "Тур — Астория" };
  }
  return {
    title: `Тур в ${data.tour.hotelName} — Астория`,
    description: `${data.tour.locationLabel}. ${data.tour.nights} ночей, от ${data.tour.priceFrom.toLocaleString("ru-RU")} ₽.`,
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { id } = await params;
  const data = await getTourDetail(id);
  if (!data) {
    notFound();
  }
  return <TourPageView data={data} />;
}
