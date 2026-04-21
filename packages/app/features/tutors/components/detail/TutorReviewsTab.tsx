import { ReviewsSection } from '@mezon-tutors/app'
import { TutorReviewsTabProps } from './types'

export function TutorReviewsTab({ tutor }: TutorReviewsTabProps) {
  return (
    <ReviewsSection
      tutorId={tutor.id}
      tutorName={`${tutor.firstName} ${tutor.lastName}`}
      ratingAverage={tutor.ratingAverage}
      ratingCount={tutor.ratingCount}
      reviews={tutor.reviews}
    />
  )
}
