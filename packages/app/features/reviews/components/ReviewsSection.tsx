'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_DISPLAY_CONFIG } from '@mezon-tutors/shared';
import { ReviewsSummary } from './ReviewsSummary';
import { ReviewCard } from './ReviewCard';
import { AllReviewsModal } from './AllReviewsModal';
import { ReviewModal } from '@mezon-tutors/app';
import { useCurrentUser } from '../../../services/auth/useCurrentUser';
import { useGetAlreadyBookedTrialLesson } from '../../../services/trial-lesson-booking/trial-lesson-booking.api';

interface ReviewsSectionProps {
  tutorId: string;
  tutorName: string;
  ratingAverage: number;
  ratingCount: number;
  reviews: Array<{
    id: string;
    reviewerId: string;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
  }>;
}

export function ReviewsSection({
  tutorId,
  tutorName,
  ratingAverage,
  ratingCount,
  reviews,
}: ReviewsSectionProps) {
  const t = useTranslations('Tutors.Detail');
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [isPostReviewOpen, setIsPostReviewOpen] = useState(false);

  const { data: currentUser, refetch } = useCurrentUser();
  const currentUserId = currentUser?.id || currentUser?.sub;

  const { data: bookingStatus, isLoading: isLoadingBooking } = useGetAlreadyBookedTrialLesson(tutorId, !!currentUserId);
  const hasCompletedLesson = bookingStatus?.hasBooked && bookingStatus?.status === 'COMPLETED';

  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);

  const myReviewFromList = useMemo(() => {
    if (!currentUserId) return null;
    return reviews.find(r => r.reviewerId === currentUserId) || null;
  }, [reviews, currentUserId]);

  const showPostReviewButton = !!currentUserId && !isLoadingBooking && hasCompletedLesson;

  const sortedReviews = useMemo(() => {
    if (!currentUserId) return reviews;
    
    const myReviewIndex = reviews.findIndex(r => r.reviewerId === currentUserId);
    if (myReviewIndex === -1) return reviews;
    
    const myReviewItem = reviews[myReviewIndex];
    const otherReviews = reviews.filter((_, index) => index !== myReviewIndex);
    
    return [myReviewItem, ...otherReviews];
  }, [reviews, currentUserId]);

  const visibleReviews = useMemo(
    () => sortedReviews.slice(0, REVIEW_DISPLAY_CONFIG.INITIAL_VISIBLE_COUNT),
    [sortedReviews],
  );

  const leftColumnReviews = useMemo(
    () => visibleReviews.filter((_, index) => index % REVIEW_DISPLAY_CONFIG.COLUMNS === 0),
    [visibleReviews],
  );

  const rightColumnReviews = useMemo(
    () => visibleReviews.filter((_, index) => index % REVIEW_DISPLAY_CONFIG.COLUMNS === 1),
    [visibleReviews],
  );

  return (
    <YStack gap="$4">
      <XStack justifyContent="space-between" alignItems="center" gap="$3" flexWrap="wrap">
        <Text color="$tutorsDetailPrimaryText" fontSize={24} fontWeight="700">
          {t('whatStudentsSay')}
        </Text>
        {showPostReviewButton && (
          <Button
            onPress={() => setIsPostReviewOpen(true)}
            backgroundColor="$tutorsDetailReviewPostButtonBg"
            color="$tutorsDetailReviewPostButtonText"
            borderRadius={8}
            paddingHorizontal="$4"
            paddingVertical="$2"
            hoverStyle={{
              backgroundColor: '$tutorsDetailReviewPostButtonHover',
              opacity: 1,
            }}
            pressStyle={{
              backgroundColor: '$tutorsDetailReviewPostButtonHover',
              opacity: 1,
            }}
          >
            {myReviewFromList ? t('editReview') : t('postReview')}
          </Button>
        )}
      </XStack>

      <ReviewsSummary ratingAverage={ratingAverage} ratingCount={ratingCount} />

      {reviews.length === 0 ? (
        <Text color="$tutorsDetailMutedText">{t('reviewsEmpty')}</Text>
      ) : (
        <>
          <Text color="$tutorsDetailMutedText" fontSize={14}>
            {t('basedOnReviews', { count: ratingCount })}
          </Text>

          <XStack gap="$3" alignItems="flex-start" width="100%">
            <YStack flex={1} gap="$3">
              {leftColumnReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwnReview={currentUserId === review.reviewerId}
                  onEdit={() => setIsPostReviewOpen(true)}
                />
              ))}
            </YStack>
            <YStack flex={1} gap="$3">
              {rightColumnReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwnReview={currentUserId === review.reviewerId}
                  onEdit={() => setIsPostReviewOpen(true)}
                />
              ))}
            </YStack>
          </XStack>

          {reviews.length > REVIEW_DISPLAY_CONFIG.INITIAL_VISIBLE_COUNT && (
            <Button
              variant="outline"
              onPress={() => setIsAllReviewsOpen(true)}
              alignSelf="center"
              marginTop="$2"
            >
              {t('showAllReviews', { count: reviews.length })}
            </Button>
          )}
        </>
      )}

      <AllReviewsModal
        reviews={sortedReviews}
        currentUserId={currentUserId}
        isOpen={isAllReviewsOpen}
        onClose={() => setIsAllReviewsOpen(false)}
        onEditReview={() => {
          setIsAllReviewsOpen(false);
          setIsPostReviewOpen(true);
        }}
      />

      <ReviewModal
        tutorId={tutorId}
        tutorName={tutorName}
        existingReview={myReviewFromList}
        isOpen={isPostReviewOpen}
        onClose={() => setIsPostReviewOpen(false)}
      />
    </YStack>
  );
}
