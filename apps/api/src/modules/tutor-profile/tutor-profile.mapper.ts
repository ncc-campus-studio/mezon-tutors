import { TutorLanguage, TutorProfile, TutorReview, User } from '@mezon-tutors/db'
import { TutorDetailDto, TutorReviewDto, VerifiedTutorProfileDto } from '@mezon-tutors/shared'

export function toVerifiedTutorProfileDto(
  tutor: TutorProfile & { languages: TutorLanguage[] },
): VerifiedTutorProfileDto {
  return {
    id: tutor.id,
    userId: tutor.userId,
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    avatar: tutor.avatar,
    videoUrl: tutor.videoUrl,
    country: tutor.country,
    subject: tutor.subject,
    introduce: tutor.introduce,
    experience: tutor.experience,
    motivate: tutor.motivate,
    headline: tutor.headline,
    pricePerHour: Number(tutor.pricePerHour),
    isProfessional: tutor.isProfessional,
    totalLessonsTaught: tutor.totalLessonsTaught,
    totalStudents: tutor.totalStudents,
    ratingCount: tutor.ratingCount,
    ratingAverage: Number(tutor.ratingAverage),
    timezone: tutor.timezone,
    languages: tutor.languages.map((language) => ({ languageCode: language.languageCode, proficiency: language.proficiency })),
  }
}

export function toTutorReviewDto(review: TutorReview & { reviewer: Pick<User, 'id' | 'username' | 'avatar'> }): TutorReviewDto {
  const { id, rating, comment, createdAt, updatedAt, reviewer } = review
  const { id: reviewerId, username: reviewerName, avatar: reviewerAvatar } = reviewer

  return {
    id,
    reviewerId,
    reviewerName,
    reviewerAvatar,
    rating,
    comment,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}

export function toTutorDetailDto(
  tutor: TutorProfile & {
    languages: TutorLanguage[]
    availability: Array<{
      dayOfWeek: number
      startTime: string
      endTime: string
      isActive: boolean
    }>
    reviews: Array<TutorReview & { reviewer: Pick<User, 'id' | 'username' | 'avatar'> }>
  },
  bookedLessonsLast48h: number,
): TutorDetailDto {
  const base = toVerifiedTutorProfileDto(tutor)

  return {
    ...base,
    availability: tutor.availability.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isActive: slot.isActive,
    })),
    reviews: tutor.reviews.map(toTutorReviewDto),
    resources: tutor.videoUrl
      ? [
          {
            id: `${tutor.id}-intro-video`,
            title: 'Intro video',
            type: 'video',
            url: tutor.videoUrl,
          },
        ]
      : [],
    stats: {
      bookedLessonsLast48h,
      totalLessonsTaught: tutor.totalLessonsTaught,
      totalStudents: tutor.totalStudents,
    },
  }
}
