export function calculateMetricScore(base: number, offset: number): number {
  return Math.min(5, Math.max(0, Number((base + offset).toFixed(1))))
}

export function normalizeRating(rating: number): number {
  return Math.max(1, Math.round(rating))
}
