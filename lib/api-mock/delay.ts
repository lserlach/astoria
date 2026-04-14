const DEFAULT_MS = 420;

export function delay(ms: number = DEFAULT_MS): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
