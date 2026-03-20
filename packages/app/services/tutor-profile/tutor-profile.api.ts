import { apiClient } from '../api-client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { tutorProfileQueryKey } from './tutor-profile.qkey'
import {
  PaginatedData,
  PaginatedResponse,
  ETutorSortBy,
  ECountry,
  ESubject,
  VerifiedTutorProfileDto,
  TANSTACK_QUERY_STALE_TIME,
} from '@mezon-tutors/shared'

type VerifiedTutorFilters = {
  sortBy: ETutorSortBy
  subject?: ESubject
  country?: ECountry
  pricePerLesson?: string
}

const getVerifiedTutors = async (
  page: number,
  limit: number,
  filters: VerifiedTutorFilters
): Promise<PaginatedData<VerifiedTutorProfileDto> | null> => {
  const { sortBy, subject, country, pricePerLesson } = filters

  const response = await apiClient.get<PaginatedResponse<VerifiedTutorProfileDto>>(
    '/tutor-profiles/verified',
    {
      params: {
        page,
        limit,
        sortBy,
        subject,
        country,
        pricePerLesson,
      },
    }
  )
  return response.data
}

const useGetVerifiedTutors = (page: number, limit: number, filters: VerifiedTutorFilters) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.verifiedTutors(
      page,
      limit,
      filters.sortBy,
      filters.subject,
      filters.country,
      filters.pricePerLesson
    ),
    queryFn: () => getVerifiedTutors(page, limit, filters),
    placeholderData: keepPreviousData,
    staleTime: TANSTACK_QUERY_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export { useGetVerifiedTutors }
