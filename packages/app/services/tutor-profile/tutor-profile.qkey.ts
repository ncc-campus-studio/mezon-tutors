export const tutorProfileQueryKey = {
  verifiedTutors: (
    page: number,
    limit: number,
    sortBy: string,
    subject?: string,
    country?: string,
    pricePerLesson?: string
  ) => [
    'verified-tutors',
    page,
    limit,
    sortBy,
    subject,
    country,
    pricePerLesson,
  ],
} as const
