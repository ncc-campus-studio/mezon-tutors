export const tutorProfileQueryKey = {
  verifiedTutors: (page: number, limit: number, sortBy: string) => [
    'verified-tutors',
    page,
    limit,
    sortBy,
  ],
} as const
