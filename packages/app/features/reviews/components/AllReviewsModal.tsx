'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Dialog, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_DISPLAY_CONFIG } from '@mezon-tutors/shared';
import { ReviewCard } from './ReviewCard';

interface AllReviewsModalProps {
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
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onEditReview?: () => void;
}

export function AllReviewsModal({ reviews, currentUserId, isOpen, onClose, onEditReview }: AllReviewsModalProps) {
  const t = useTranslations('Tutors.Detail');
  const [visibleCount, setVisibleCount] = useState<number>(REVIEW_DISPLAY_CONFIG.LOAD_MORE_COUNT);

  useEffect(() => {
    if (isOpen) {
      setVisibleCount(REVIEW_DISPLAY_CONFIG.LOAD_MORE_COUNT);
    }
  }, [isOpen]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + REVIEW_DISPLAY_CONFIG.LOAD_MORE_COUNT, reviews.length));
    }
  }, [hasMore, reviews.length]);

  return (
    <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxWidth={650}
          width="90%"
          maxHeight="90vh"
          backgroundColor="$tutorsDetailReviewModalBackground"
          borderColor="$tutorsDetailReviewModalBorder"
          padding="$5"
          paddingBottom="$5"
          borderRadius={16}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.15}
          shadowRadius={24}
          elevation={8}
        >
          <Dialog.Title
            color="$tutorsDetailReviewModalTitle"
            fontSize={20}
            fontWeight="700"
          >
            {t('allReviewsTitle')}
          </Dialog.Title>
          <Dialog.Description
            color="$tutorsDetailSecondaryText"
            fontSize={13}
            marginTop="$1"
          >
            {t('basedOnReviews', { count: reviews.length })}
          </Dialog.Description>

          <YStack 
            flex={1}
            maxHeight={520} 
            overflow="scroll" 
            gap="$3" 
            paddingRight="$2"
            paddingBottom="$4"
            marginTop="$3"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            className="hide-scrollbar"
          >
            {visibleReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                showFullComment 
                isOwnReview={currentUserId === review.reviewerId}
                onEdit={onEditReview}
                compact
              />
            ))}
            
            {hasMore && (
              <YStack alignItems="center" marginTop="$2">
                <Button 
                  variant="outline" 
                  onPress={loadMore}
                  paddingHorizontal="$6"
                  paddingVertical="$2.5"
                  borderRadius={10}
                  alignSelf="center"
                >
                  {t('loadMoreReviews')}
                </Button>
              </YStack>
            )}
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
