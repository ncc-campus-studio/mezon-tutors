'use client';

import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_STAR_SIZE, REVIEW_STAR_GAP } from '@mezon-tutors/shared';
import { ReviewStarRating } from './ReviewStarRating';

interface ReviewsSummaryProps {
  ratingAverage: number;
  ratingCount: number;
}

export function ReviewsSummary({ ratingAverage, ratingCount }: ReviewsSummaryProps) {
  const t = useTranslations('Tutors.Detail');

  return (
    <YStack gap="$2">
      <Text color="$tutorsDetailPrimaryText" fontSize={38} fontWeight="900" lineHeight={40}>
        {ratingAverage.toFixed(2)}
      </Text>
      <ReviewStarRating 
        rating={Math.round(ratingAverage)} 
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
