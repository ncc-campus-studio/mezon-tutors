import { Button, Card, Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { StarOutlineIcon } from '@mezon-tutors/app/ui/icons'
import {
  calculateMetricScore,
  formatDateDMY,
  generatePageNumbers,
  normalizeRating,
  TUTOR_DETAIL_DEFAULT_VISIBLE_REVIEW_COUNT,
  TUTOR_DETAIL_REVIEW_METRICS,
} from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useTheme } from 'tamagui'
import { TutorReviewsTabProps } from './types'

export function TutorReviewsTab({ tutor }: TutorReviewsTabProps) {
  const t = useTranslations('Tutors.Detail')
  const theme = useTheme()
  const [currentPage, setCurrentPage] = useState(1)

  const reviewsPerPage = TUTOR_DETAIL_DEFAULT_VISIBLE_REVIEW_COUNT
  const totalPages = Math.ceil(tutor.reviews.length / reviewsPerPage)
  const hasMultiplePages = totalPages > 1
  const starColor = theme.tutorsDetailStarGold?.get()

  const reviewMetrics = useMemo(
    () =>
      TUTOR_DETAIL_REVIEW_METRICS.map((metric) => ({
        key: metric.key,
        value: calculateMetricScore(tutor.ratingAverage, metric.offset),
      })),
    [tutor.ratingAverage],
  )

  const visibleReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage
    const endIndex = startIndex + reviewsPerPage
    return tutor.reviews.slice(startIndex, endIndex)
  }, [tutor.reviews, currentPage, reviewsPerPage])

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  )

  const renderStars = (count: number, keyPrefix: string) => (
    <XStack gap={2} alignItems="center">
      {Array.from({ length: count }).map((_, index) => (
        <StarOutlineIcon key={`${keyPrefix}-star-${index}`} size={14} color={starColor} />
      ))}
    </XStack>
  )

  return (
    <YStack gap="$3.5">
      <XStack alignItems="flex-end" justifyContent="space-between" gap="$3" flexWrap="wrap">
        <YStack>
          <Text color="$tutorsDetailPrimaryText" fontSize={38} fontWeight="900" lineHeight={40}>
            {tutor.ratingAverage.toFixed(2)}
          </Text>
          <Text color="$tutorsDetailAccentText" fontWeight="700">
            {t('reviewsCount', { count: tutor.ratingCount })}
          </Text>
          {renderStars(5, 'summary')}
        </YStack>

        <XStack gap="$4" flexWrap="wrap">
          {reviewMetrics.map((metric) => (
            <YStack key={metric.key} minWidth={86} gap={2}>
              <Text color="$tutorsDetailMutedText" fontSize={11} textTransform="uppercase">
                {t(`reviewMetrics.${metric.key}`)}
              </Text>
              <Text color="$tutorsDetailPrimaryText" fontWeight="800">
                {metric.value.toFixed(1)}
              </Text>
            </YStack>
          ))}
        </XStack>
      </XStack>

      {tutor.reviews.length === 0 ? (
        <Text color="$tutorsDetailMutedText">{t('reviewsEmpty')}</Text>
      ) : (
        visibleReviews.map((review) => (
          <Card
            key={review.id}
            backgroundColor="$tutorsDetailReviewCardBackground"
            borderWidth={1}
            borderColor="$tutorsDetailReviewCardBorder"
            borderRadius={14}
            padding="$3"
          >
            <XStack justifyContent="space-between" alignItems="center" gap="$2" flexWrap="wrap">
              <YStack>
                <Text color="$tutorsDetailPrimaryText" fontWeight="700">
                  {review.reviewerName}
                </Text>
                <Text color="$tutorsDetailMutedText" fontSize={12}>
                  {formatDateDMY(review.createdAt)} - {t('reviewRecentLabel')}
                </Text>
              </YStack>
              {renderStars(normalizeRating(review.rating), `review-${review.id}`)}
            </XStack>
            <Paragraph color="$tutorsDetailSecondaryText">{review.comment}</Paragraph>
          </Card>
        ))
      )}

      {hasMultiplePages && (
        <XStack gap="$2" justifyContent="center" alignItems="center" flexWrap="wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            opacity={currentPage === 1 ? 0.5 : 1}
          >
            {t('pagination.previous')}
          </Button>

          {pageNumbers.map((item, index) =>
            item.isEllipsis ? (
              <Text key={`ellipsis-${index}`} color="$tutorsDetailMutedText" paddingHorizontal="$2">
                ...
              </Text>
            ) : (
              <Button
                key={item.page}
                variant={item.page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setCurrentPage(item.page)}
                minWidth={40}
              >
                {item.page}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            opacity={currentPage === totalPages ? 0.5 : 1}
          >
            {t('pagination.next')}
          </Button>
        </XStack>
      )}
    </YStack>
  )
}
