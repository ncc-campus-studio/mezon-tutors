'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Dialog, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_DISPLAY_CONFIG } from '@mezon-tutors/shared';
import { ReviewCard } from './ReviewCard';
import { ReviewStarRating } from './ReviewStarRating';
import { useMedia, useTheme } from 'tamagui';
import { ArrowLeftIcon } from '@mezon-tutors/app/ui/icons';

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
  ratingAverage: number;
  ratingCount: number;
}

export function AllReviewsModal({ 
  reviews, 
  currentUserId, 
  isOpen, 
  onClose, 
  onEditReview,
  ratingAverage,
  ratingCount 
}: AllReviewsModalProps) {
  const t = useTranslations('Tutors.Detail');
  const theme = useTheme();
  const media = useMedia();
  const isMobile = media.sm || media.xs;
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

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [reviews]);

  const maxCount = Math.max(...Object.values(ratingDistribution));

  const ratingBars = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratingDistribution[star as keyof typeof ratingDistribution];
      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
      return { star, count, percentage };
    });
  }, [ratingDistribution, maxCount]);

  const isOwnReview = useCallback((reviewerId: string) => {
    return currentUserId === reviewerId;
  }, [currentUserId]);

  if (isMobile) {
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
            key="content"
            animateOnly={['transform']}
            animation="100ms"
            enterStyle={{ y: '100%' }}
            exitStyle={{ y: '100%' }}
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            top={0}
            width="100%"
            height="100%"
            maxWidth="100%"
            maxHeight="100%"
            backgroundColor="$tutorsDetailCardBackground"
            padding={0}
            margin={0}
            borderRadius={0}
          >
            <YStack height="100%" width="100%">
              <XStack
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderBottomWidth={1}
                borderBottomColor="$tutorsDetailDivider"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Button
                  chromeless
                  onPress={onClose}
                  padding={0}
                  position="absolute"
                  left="$4"
                >
                  <ArrowLeftIcon size={24} color={theme.tutorsDetailSecondaryText?.get()} />
                </Button>
                <Text color="$tutorsDetailPrimaryText" fontSize={17} fontWeight="600">
                  {t('allReviewsTitle')}
                </Text>
              </XStack>

              <YStack
                flex={1}
                overflow="scroll"
                paddingHorizontal="$4"
                paddingTop="$4"
              >
                <YStack gap="$4" marginBottom="$4">
                  <XStack gap="$4" alignItems="flex-start">
                    <YStack gap="$2" alignItems="center" minWidth={80}>
                      <Text color="$tutorsDetailPrimaryText" fontSize={48} fontWeight="900" lineHeight={48}>
                        {ratingAverage.toFixed(1)}
                      </Text>
                      <ReviewStarRating 
                        rating={ratingAverage} 
                        readonly 
                        size={16}
                        gap={2}
                      />
                      <Text color="$tutorsDetailMutedText" fontSize={13}>
                        {ratingCount} {t('reviews')}
                      </Text>
                    </YStack>

                    <YStack flex={1} gap="$1.5">
                      {ratingBars.map(({ star, percentage }) => (
                        <XStack key={star} gap="$2" alignItems="center">
                          <Text color="$tutorsDetailPrimaryText" fontSize={13} minWidth={12}>
                            {star}
                          </Text>
                          <YStack flex={1} height={8} backgroundColor="$tutorsDetailDivider" borderRadius={4} overflow="hidden">
                            <YStack 
                              height="100%" 
                              width={`${percentage}%`}
                              backgroundColor="$tutorsDetailPrimaryText"
                            />
                          </YStack>
                        </XStack>
                      ))}
                    </YStack>
                  </XStack>
                </YStack>

                <YStack gap="$3" paddingBottom="$4">
                  <Text color="$tutorsDetailPrimaryText" fontSize={18} fontWeight="700">
                    {ratingCount} {t('reviews')}
                  </Text>
                  
                  {visibleReviews.map((review) => {
                    const isOwn = isOwnReview(review.reviewerId);
                    return (
                      <ReviewCard 
                        key={review.id} 
                        review={review} 
                        showFullComment 
                        isOwnReview={isOwn}
                        onEdit={onEditReview}
                        compact
                      />
                    );
                  })}
                  
                  {hasMore && (
                    <Button 
                      variant="outline" 
                      onPress={loadMore}
                      marginTop="$2"
                      borderRadius={12}
                    >
                      {t('loadMoreReviews')}
                    </Button>
                  )}
                </YStack>
              </YStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  }

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
            {visibleReviews.map((review) => {
              const isOwn = isOwnReview(review.reviewerId);
              return (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  showFullComment 
                  isOwnReview={isOwn}
                  onEdit={onEditReview}
                  compact
                />
              );
            })}
            
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
