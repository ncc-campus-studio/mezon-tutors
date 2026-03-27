import { apiClient } from '../api-client'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tutorProfileQueryKey } from './tutor-profile.qkey'
import {
  ApiResponse,
  PaginatedData,
  PaginatedResponse,
  ETutorSortBy,
  ECountry,
  ESubject,
  VerifiedTutorProfileDto,
  TutorDetailDto,
  TutorAboutDto,
  TutorScheduleDto,
  TutorReviewsDto,
  TutorResourcesDto,
  SubmitTutorProfileDto,
} from '@mezon-tutors/shared'

type VerifiedTutorFilters = {
  sortBy: ETutorSortBy
  subject?: ESubject
  country?: ECountry
  pricePerLesson?: string
}

export const tutorProfileApi = {
  async getVerifiedTutors(
    page: number,
    limit: number,
    filters: VerifiedTutorFilters
  ): Promise<PaginatedData<VerifiedTutorProfileDto> | null> {
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
  },

  getTutorAbout(id: string): Promise<TutorAboutDto> {
    return apiClient.get<ApiResponse<TutorAboutDto>, TutorAboutDto>(`/tutor-profiles/${id}/about`)
  },

  getTutorSchedule(id: string): Promise<TutorScheduleDto> {
    return apiClient.get<ApiResponse<TutorScheduleDto>, TutorScheduleDto>(
      `/tutor-profiles/${id}/schedule`
    )
  },

  getTutorReviews(id: string): Promise<TutorReviewsDto> {
    return apiClient.get<ApiResponse<TutorReviewsDto>, TutorReviewsDto>(
      `/tutor-profiles/${id}/reviews`
    )
  },

  getTutorResources(id: string): Promise<TutorResourcesDto> {
    return apiClient.get<ApiResponse<TutorResourcesDto>, TutorResourcesDto>(
      `/tutor-profiles/${id}/resources`
    )
  },

  submit(payload: SubmitTutorProfileDto): Promise<boolean> {
    return apiClient.post<ApiResponse<boolean>, boolean>('/tutor-profiles', payload)
  },
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
    queryFn: () => tutorProfileApi.getVerifiedTutors(page, limit, filters),
    placeholderData: keepPreviousData,
  })
}

const useGetTutorAbout = (id: string) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.tutorAbout(id),
    queryFn: () => tutorProfileApi.getTutorAbout(id),
    enabled: !!id,
  })
}

const useGetTutorSchedule = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.tutorSchedule(id),
    queryFn: () => tutorProfileApi.getTutorSchedule(id),
    enabled: !!id && enabled,
  })
}

const useGetTutorReviews = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.tutorReviews(id),
    queryFn: () => tutorProfileApi.getTutorReviews(id),
    enabled: !!id && enabled,
  })
}

const useGetTutorResources = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: tutorProfileQueryKey.tutorResources(id),
    queryFn: () => tutorProfileApi.getTutorResources(id),
    enabled: !!id && enabled,
  })
}

const useSubmitTutorProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitTutorProfileDto) => tutorProfileApi.submit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verified-tutors'] })
    },
  })
}

export function submitTutorProfile(payload: SubmitTutorProfileDto): Promise<boolean> {
  return tutorProfileApi.submit(payload)
}

export {
  useGetVerifiedTutors,
  useGetTutorAbout,
  useGetTutorSchedule,
  useGetTutorReviews,
  useGetTutorResources,
  useSubmitTutorProfileMutation,
}
