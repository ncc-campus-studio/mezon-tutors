export function normalizeRating(rating: number): number {
  return Math.max(1, Math.round(rating))
}
