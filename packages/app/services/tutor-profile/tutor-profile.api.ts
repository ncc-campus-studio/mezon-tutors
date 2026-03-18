import { apiClient } from '../api-client'
import { useQuery } from '@tanstack/react-query'
import { tutorProfileQueryKey } from './tutor-profile.qkey'
import {
  PaginatedData,
  PaginatedResponse,
  SortBy,
  VerifiedTutorProfileDto,
} from '@mezon-tutors/shared'

const getVerifiedTutors = async (
  page: number,
  limit: number,
  sortBy: SortBy
): Promise<PaginatedData<VerifiedTutorProfileDto> | null> => {
  const response = await apiClient.get<PaginatedResponse<VerifiedTutorProfileDto>>(
    '/tutor-profiles/verified',
    {
      params: {
        page,
        limit,
        sortBy,
      },
    }
  )
  return response.data
}

const useGetVerifiedTutors = (page: number, limit: number, sortBy: SortBy) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.verifiedTutors(page, limit, sortBy),
    queryFn: () => getVerifiedTutors(page, limit, sortBy),
  })
}

export { useGetVerifiedTutors }
