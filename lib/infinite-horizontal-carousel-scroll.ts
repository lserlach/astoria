/**
 * Horizontal section carousel: step by step; at an end, jump to the opposite end.
 */
export function scrollInfiniteHorizontal(
  track: HTMLDivElement,
  dir: -1 | 1,
  stepPx: number,
): void {
  const { scrollLeft, scrollWidth, clientWidth } = track;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  if (maxScroll <= 2) {
    return;
  }

  if (dir === 1 && scrollLeft >= maxScroll - 2) {
    track.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }
  if (dir === -1 && scrollLeft <= 2) {
    track.scrollTo({ left: maxScroll, behavior: "smooth" });
    return;
  }

  track.scrollBy({ left: dir * stepPx, behavior: "smooth" });
}

export function trackMaxScroll(el: HTMLDivElement): number {
  return Math.max(0, el.scrollWidth - el.clientWidth);
}
