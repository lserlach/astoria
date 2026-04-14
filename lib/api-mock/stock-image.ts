/**
 * Stock photos via Unsplash CDN (hotlinking per Unsplash guidelines).
 * Do not use for user-uploaded assets under /public (e.g. /destinations/*).
 */

const TRAVEL_PHOTOS = [
  "photo-1507525428034-b723cf961d3e",
  "photo-1566073771259-6a8506099945",
  "photo-1582719508461-905c673771fd",
  "photo-1520250497591-112f2f40a3f4",
  "photo-1551882547-ff40c63fe5fa",
  "photo-1571003123894-1f0594d2b5d9",
  "photo-1523906834658-6e24ef2386f9",
  "photo-1512343879784-a960bf40e7f2",
  "photo-1542314831-068cd1dbfeeb",
  "photo-1571896349842-33c89424de2d",
  "photo-1499793983690-e29da59ef1c2",
  "photo-1502602898657-3e91760cbb34",
  "photo-1476514525535-07fb3b4ae5f1",
  "photo-1436491865332-7a61a109cc05",
  "photo-1488646953014-85cb44e25828",
  "photo-1537996194471-e657df975ab4",
  "photo-1564501049412-61c2a3083791",
  "photo-1570077188670-e3a8d69ac5ff",
] as const;

export function stockTravelImage(
  seed: number,
  width: number,
  height: number,
): string {
  const n = TRAVEL_PHOTOS.length;
  const idx = ((seed % n) + n) % n;
  const id = TRAVEL_PHOTOS[idx];
  const q = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(width),
    h: String(height),
    q: "80",
  });
  return `https://images.unsplash.com/${id}?${q.toString()}`;
}

