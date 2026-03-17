'use client';

import { Paragraph, Text, XStack, YStack, Card } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import type { LessonReview } from '@mezon-tutors/shared';
import { StarHalfIcon } from '@mezon-tutors/app/ui/icons';
import { StarFilledIcon } from '@mezon-tutors/app/ui/icons';
import { StarBlankIcon } from '@mezon-tutors/app/ui/icons';
import { ReactNode } from 'react';

type Props = {
  studentReviews: LessonReview[];
};

export function StudentReviewsTab({ studentReviews }: Props) {
  const t = useTranslations('AdminTutorApplications.Detail');

  const hasData = studentReviews && studentReviews.length > 0;

  const metricKeys = ['reassurance', 'clarity', 'progress', 'preparation'] as const;

  const metricSummary = hasData
    ? metricKeys.reduce(
        (acc, key) => {
          const values = studentReviews
            .map((r) => r.performance?.[key])
            .filter((v): v is number => typeof v === 'number');

          const avg =
            values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : null;

          return { ...acc, [key]: avg };
        },
        {} as Record<(typeof metricKeys)[number], number | null>
      )
    : null;

  const overallRatings = hasData
    ? studentReviews
        .map((r) => {
          if (!r.performance) return null;
          const vals = metricKeys
            .map((key) => r.performance?.[key])
            .filter((v): v is number => typeof v === 'number');
          if (!vals.length) return null;
          return vals.reduce((s, v) => s + v, 0) / vals.length;
        })
        .filter((v): v is number => v != null)
    : [];

  const overallAverage =
    overallRatings.length > 0
      ? overallRatings.reduce((s, v) => s + v, 0) / overallRatings.length
      : null;

  const totalReviews = overallRatings.length;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = overallRatings.filter((r) => Math.round(r) === star).length;
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percent };
  });

  function renderStars(rating: number): ReactNode[] {
    const stars: ReactNode[] = [];

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarFilledIcon
          key={`full-${i}`}
          size={16}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalfIcon
          key="half"
          size={16}
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarBlankIcon
          key={`empty-${i}`}
          size={16}
        />
      );
    }

    return stars;
  }
  return (
    <YStack gap="$5">
      <YStack gap="$1">
        <Paragraph
          fontSize={22}
          fontWeight="700"
        >
          {t('tabs.studentReviews')}
        </Paragraph>
        <Text
          size="sm"
          variant="muted"
        >
          {t('sections.studentReviews.subtitle')}
        </Text>
      </YStack>

      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        {hasData && overallAverage != null ? (
          <XStack
            gap="$6"
            $xs={{ flexDirection: 'column' }}
          >
            <YStack
              width={160}
              gap="$2"
            >
              <Text
                fontSize={20}
                fontWeight={600}
              >
                {t('sections.studentReviews.reviewSummaryTitle')}
              </Text>
              <YStack
                padding="$4"
                borderRadius="$6"
                backgroundColor="$backgroundMuted"
                alignItems="center"
                justifyContent="center"
                gap="$2"
              >
                <Paragraph
                  fontSize={40}
                  fontWeight="800"
                >
                  {overallAverage.toFixed(1)}
                </Paragraph>
                <Text>{renderStars(overallAverage)}</Text>
                <Text
                  size="sm"
                  variant="muted"
                >
                  {totalReviews} reviews
                </Text>
              </YStack>
            </YStack>

            <YStack
              flex={1}
              gap="$4"
            >
              <Text
                fontSize={20}
                fontWeight={600}
              >
                {t('sections.studentReviews.ratingBreakdownTitle')}
              </Text>
              <YStack gap="$1">
                {breakdown.map((row) => (
                  <XStack
                    key={row.star}
                    alignItems="center"
                    gap="$3"
                  >
                    <Text width={16}>{row.star}</Text>
                    <YStack
                      flex={1}
                      height={6}
                      borderRadius={999}
                      backgroundColor="$backgroundMuted"
                    >
                      <YStack
                        height="100%"
                        borderRadius={999}
                        backgroundColor="$appPrimary"
                        width={`${row.percent}%`}
                      />
                    </YStack>
                    <Text
                      variant="muted"
                      width={40}
                      textAlign="right"
                    >
                      {row.percent}%
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>

            <YStack
              flex={1}
              gap="$3"
            >
              <Text
                fontSize={20}
                fontWeight={600}
              >
                {t('sections.studentReviews.performanceTitle')}
              </Text>
              {metricKeys.map((key) => (
                <YStack
                  key={key}
                  gap="$1"
                >
                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text variant="muted">{t(`sections.studentReviews.metrics.${key}`)}</Text>
                    <Text
                      size="sm"
                      fontWeight="600"
                    >
                      {metricSummary && metricSummary[key] != null
                        ? `${metricSummary[key]!.toFixed(1)}/5`
                        : '–'}
                    </Text>
                  </XStack>
                  <YStack
                    height={6}
                    borderRadius={999}
                    backgroundColor="$backgroundMuted"
                  >
                    <YStack
                      height="100%"
                      borderRadius={999}
                      backgroundColor="$appPrimary"
                      width={
                        metricSummary && metricSummary[key] != null
                          ? `${Math.min(100, (metricSummary[key]! / 5) * 100)}%`
                          : '0%'
                      }
                    />
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </XStack>
        ) : (
          <Text
            size="sm"
            variant="muted"
          >
            {t('sections.studentReviews.noData')}
          </Text>
        )}
      </Card>

      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        {!hasData ? (
          <Text
            size="sm"
            variant="muted"
          >
            {t('sections.studentReviews.noData')}
          </Text>
        ) : (
          <YStack gap="$2">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingVertical="$2"
            >
              <Paragraph
                fontSize={18}
                fontWeight="700"
              >
                Detailed Reviews
              </Paragraph>
              <Text
                size="sm"
                variant="muted"
              >
                Most Recent
              </Text>
            </XStack>

            {studentReviews.map((r) => (
              <Card
                key={r.id}
                padding="$4"
                borderRadius="$8"
                backgroundColor="$background"
                marginTop="$3"
              >
                <XStack
                  gap="$3"
                  alignItems="flex-start"
                >
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={999}
                    backgroundColor="$backgroundMuted"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontWeight="600"
                      size="sm"
                    >
                      {r.id.slice(0, 2).toUpperCase()}
                    </Text>
                  </YStack>
                  <YStack
                    flex={1}
                    gap="$1"
                  >
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <YStack gap="$1">
                        <Text fontWeight="600">Lesson {r.id.slice(0, 6)}</Text>
                        <Text variant="muted">
                          {r.startAt instanceof Date
                            ? r.startAt.toLocaleDateString()
                            : String(r.startAt)}
                        </Text>
                      </YStack>
                      {r.performance && (
                        <Text
                          size="sm"
                          color="$appPrimary"
                          fontWeight="600"
                        >
                          {renderStars(
                            metricKeys
                              .map((key) => r.performance?.[key] ?? 0)
                              .reduce((s, v) => s + v, 0) / metricKeys.length
                          )}
                        </Text>
                      )}
                    </XStack>
                    {r.performance && (
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        Reassurance {r.performance.reassurance.toFixed(1)} · Clarity{' '}
                        {r.performance.clarity.toFixed(1)} · Progress{' '}
                        {r.performance.progress.toFixed(1)} · Preparation{' '}
                        {r.performance.preparation.toFixed(1)}
                      </Text>
                    )}
                  </YStack>
                </XStack>
              </Card>
            ))}
          </YStack>
        )}
      </Card>
    </YStack>
  );
}
