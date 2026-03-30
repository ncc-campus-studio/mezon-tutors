import {
  TutorDetailDto,
  TutorDetailTabKey,
  TutorAboutDto,
  TutorDetailAvailabilitySlotDto,
  TutorReviewDto,
  TutorResourceDto,
} from '@mezon-tutors/shared'

export type TutorDetailTab = TutorDetailTabKey

export type TutorDetailContentProps = {
  tutor: TutorDetailDto
}

export type TutorAboutTabProps = {
  tutor: TutorAboutDto
}

export type TutorScheduleTabProps = {
  tutor: TutorAboutDto & {
    availability: TutorDetailAvailabilitySlotDto[]
  }
}

export type TutorReviewsTabProps = {
  tutor: TutorAboutDto & {
    reviews: TutorReviewDto[]
    ratingCount: number
    ratingAverage: number
  }
}

export type TutorResourcesTabProps = {
  tutor: TutorAboutDto & {
    resources: TutorResourceDto[]
  }
}
