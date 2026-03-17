export function calculateAverageDurationHours(
  items: { createdAt: Date; updatedAt: Date }[]
): number {
  if (!items.length) return 0;

  const total = items.reduce((sum, item) => {
    const hours = (item.updatedAt.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  return total / items.length;
}
