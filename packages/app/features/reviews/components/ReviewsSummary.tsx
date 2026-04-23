'use client';

import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_STAR_SIZE, REVIEW_STAR_GAP } from '@mezon-tutors/shared';
import { ReviewStarRating } from './ReviewStarRating';

interface ReviewsSummaryProps {
  ratingAverage: number;
  ratingCount: number;
  isMobile?: boolean;
}

export function ReviewsSummary({ ratingAverage, ratingCount, isMobile = false }: ReviewsSummaryProps) {
  const t = useTranslations('Tutors.Detail');

  if (isMobile) {
    return (
      <XStack gap="$3" alignItems="center">
        <Text color="$tutorsDetailPrimaryText" fontSize={48} fontWeight="900" lineHeight={48}>
          {ratingAverage.toFixed(1)}
        </Text>
        <YStack gap="$1">
          <ReviewStarRating 
            rating={ratingAverage} 
            readonly 
            size={24}
            gap={4}
          />
          <Text color="$tutorsDetailMutedText" fontSize={13}>
            {t('basedOnReviews', { count: ratingCount })}
          </Text>
        </YStack>
      </XStack>
    );
  }

  return (
    <YStack gap="$2">
      <Text color="$tutorsDetailPrimaryText" fontSize={38} fontWeight="900" lineHeight={40}>
        {ratingAverage.toFixed(2)}
      </Text>
      <ReviewStarRating 
        rating={ratingAverage} 
        readonly 
        size={REVIEW_STAR_SIZE.SMALL}
        gap={REVIEW_STAR_GAP.SMALL}
      />
      <Text color="$tutorsDetailAccentText" fontWeight="700">
        {t('reviewsCount', { count: ratingCount })}
      </Text>
    </YStack>
  );
}
