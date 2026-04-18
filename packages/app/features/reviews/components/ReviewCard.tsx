'use client';

import { useState } from 'react';
import { Card, Paragraph, Text, XStack, YStack, Button } from '@mezon-tutors/app/ui';
import { EditIcon } from '@mezon-tutors/app/ui/icons';
import { formatDateDMY, REVIEW_AVATAR, REVIEW_DISPLAY_CONFIG, REVIEW_STAR_SIZE, REVIEW_STAR_GAP } from '@mezon-tutors/shared';
import { useTranslations } from 'next-intl';
import { Image, useTheme } from 'tamagui';
import { ReviewStarRating } from './ReviewStarRating';

interface ReviewCardProps {
  review: {
    id: string;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
  };
  showFullComment?: boolean;
  isOwnReview?: boolean;
  onEdit?: () => void;
  compact?: boolean;
}

export function ReviewCard({ review, showFullComment = false, isOwnReview = false, onEdit, compact = false }: ReviewCardProps) {
  const t = useTranslations('Tutors.Detail');
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(showFullComment);
  
  const shouldTruncate = !showFullComment && review.comment.length > REVIEW_DISPLAY_CONFIG.COMMENT_PREVIEW_LENGTH;
  const displayComment = isExpanded || showFullComment
    ? review.comment
    : review.comment.slice(0, REVIEW_DISPLAY_CONFIG.COMMENT_PREVIEW_LENGTH) + (shouldTruncate ? '...' : '');

  const avatarUrl = review.reviewerAvatar || REVIEW_AVATAR.DEFAULT_URL;
  const isEdited = review.updatedAt && review.updatedAt !== review.createdAt;

  return (
    <Card
      backgroundColor="$tutorsDetailReviewCardBackground"
      borderWidth={1}
      borderColor="$tutorsDetailReviewCardBorder"
      borderRadius={14}
      padding="$3"
      minHeight={compact ? undefined : REVIEW_DISPLAY_CONFIG.CARD_MIN_HEIGHT}
    >
      <XStack gap="$3" alignItems="flex-start" height={compact ? undefined : "100%"}>
        <Image
          source={{ uri: avatarUrl }}
          width={REVIEW_AVATAR.SIZE}
          height={REVIEW_AVATAR.SIZE}
          borderRadius={REVIEW_AVATAR.SIZE / 2}
          backgroundColor="$tutorsDetailMutedText"
        />
        
        <YStack flex={1} gap="$2" height={compact ? undefined : "100%"}>
          <XStack justifyContent="space-between" alignItems="flex-start" gap="$2" flexWrap="wrap">
            <YStack flex={1}>
              <Text color="$tutorsDetailPrimaryText" fontWeight="700">
                {review.reviewerName}
              </Text>
              <XStack gap="$1" alignItems="center">
                <Text color="$tutorsDetailMutedText" fontSize={12}>
                  {formatDateDMY(review.createdAt)}
                </Text>
                {isEdited && (
                  <Text color="$tutorsDetailMutedText" fontSize={12}>
                    (edited)
                  </Text>
                )}
              </XStack>
            </YStack>
            <XStack gap="$2" alignItems="center">
              <ReviewStarRating 
                rating={review.rating} 
                readonly 
                size={REVIEW_STAR_SIZE.SMALL}
                gap={REVIEW_STAR_GAP.SMALL}
              />
              {isOwnReview && onEdit && (
                <XStack
                  cursor="pointer"
                  onPress={onEdit}
                  padding="$2"
                  borderRadius={8}
                  backgroundColor="$tutorsDetailCardBackground"
                  borderWidth={1}
                  borderColor="$tutorsDetailCardBorder"
                  hoverStyle={{
                    backgroundColor: '$tutorsDetailChipBackground',
                  }}
                >
                  <EditIcon size={16} color={theme.tutorsDetailSecondaryText?.get()} />
                </XStack>
              )}
            </XStack>
          </XStack>
          
          <YStack flex={compact ? undefined : 1}>
            <Paragraph color="$tutorsDetailSecondaryText" numberOfLines={isExpanded ? undefined : 4}>
              {displayComment}
            </Paragraph>
          </YStack>
          
          {shouldTruncate && !showFullComment && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setIsExpanded(!isExpanded)}
              paddingHorizontal={0}
              alignSelf="flex-start"
            >
              <Text color="$tutorsDetailAccentText" fontSize={12}>
                {isExpanded ? t('showLess') : t('showMore')}
              </Text>
            </Button>
          )}
        </YStack>
      </XStack>
    </Card>
  );
}
