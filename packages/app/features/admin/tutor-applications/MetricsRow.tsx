import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'
import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { TaskIcon } from '@mezon-tutors/app/ui/icons/TaskIcon'
import { TimerIcon } from '@mezon-tutors/app/ui/icons/TimerIcon'
import { VerifiedIcon } from '@mezon-tutors/app/ui/icons'
import { tutorApplicationService } from '@mezon-tutors/app/services/tutor-application.service'
import type { TutorApplicationMetricsApi } from '@mezon-tutors/shared'
import type { MetricCard, MetricStatus } from './types'
import { AdminMetric } from './types'

function mapMetricsApiToCards(api: TutorApplicationMetricsApi): MetricCard[] {
  return [
    {
      id: AdminMetric.TotalPending,
      value: String(api.total_pending),
      changePercent: api.total_pending_change_percent ?? 0,
      betterWhen: 'lower',
      titleKey: 'metrics.totalPending.title',
      helperKey: 'metrics.totalPending.helper',
    },
    {
      id: AdminMetric.ApprovedToday,
      value: String(api.approved_today),
      changePercent: api.approved_today_change_percent ?? 0,
      betterWhen: 'higher',
      titleKey: 'metrics.approvedToday.title',
      helperKey: 'metrics.approvedToday.helper',
    },
    {
      id: AdminMetric.AvgReviewTime,
      value: `${api.avg_review_time_hours}h`,
      changePercent: api.avg_review_time_change_percent ?? 0,
      betterWhen: 'lower',
      titleKey: 'metrics.avgReviewTime.title',
      helperKey: 'metrics.avgReviewTime.helper',
    },
  ]
}

const STATUS_COLORS: Record<
  MetricStatus,
  { bg: string; border: string; pillBg: string; pillText: string }
> = {
  good: {
    bg: '$backgroundCard',
    border: '$green6',
    pillBg: 'rgba(72, 187, 120, 0.2)',
    pillText: '#48BB78',
  },
  warning: {
    bg: '$backgroundCard',
    border: '$blue6',
    pillBg: 'rgba(66, 153, 225, 0.2)',
    pillText: '#4299E1',
  },
  bad: {
    bg: '$backgroundCard',
    border: '$red6',
    pillBg: 'rgba(245, 101, 101, 0.2)',
    pillText: '#F56565',
  },
}

function getMetricStatus(metric: MetricCard): MetricStatus {
  if (metric.betterWhen === 'higher') {
    if (metric.changePercent >= 10) return 'good'
    if (metric.changePercent >= 0) return 'warning'
    return 'bad'
  }

  if (metric.changePercent <= -10) return 'good'
  if (metric.changePercent <= 0) return 'warning'
  return 'bad'
}

export function TutorApplicationsMetricsRow() {
  const t = useTranslations('Admin.TutorApplications')
  const theme = useTheme()
  const iconColor = theme.appPrimary?.val
  const itemBackground = theme.itemBackground?.val

  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tutorApplicationService.getMetrics()
      setMetrics(mapMetricsApiToCards(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics')
      setMetrics([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  if (loading) {
    return (
      <XStack gap={32} flexWrap="wrap" marginHorizontal={30}>
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            flexBasis={260}
            flexGrow={1}
            minWidth={200}
            backgroundColor="$backgroundCard"
            padding={16}
          >
            <Text size="sm" variant="muted">
              Loading...
            </Text>
          </Card>
        ))}
      </XStack>
    )
  }

  if (error) {
    return (
      <XStack marginHorizontal={30} padding={12} backgroundColor="$red3" borderRadius={8}>
        <Text size="sm" color="$red11">
          {error}
        </Text>
      </XStack>
    )
  }

  return (
    <XStack gap={32} flexWrap="wrap" marginHorizontal={30}>
      {metrics.map((metric) => {
        const status = getMetricStatus(metric)
        const colors = STATUS_COLORS[status]

        const Icon =
          metric.id === AdminMetric.TotalPending
            ? TaskIcon
            : metric.id === AdminMetric.ApprovedToday
              ? VerifiedIcon
              : TimerIcon

        return (
          <Card
            key={metric.id}
            flexBasis={260}
            flexGrow={1}
            backgroundColor={colors.bg}
            minWidth={200}
          >
            <XStack alignItems="center" justifyContent="space-between" marginTop={9}>
              <Text size="sm" fontWeight="600" fontSize={14} variant="muted">
                {t(metric.titleKey)}
              </Text>
            </XStack>

            <XStack alignItems="center" justifyContent="space-between">
              <YStack gap={4}>
                <Text size="lg" fontWeight="900" fontSize={25} variant="default">
                  {metric.value}
                </Text>
                <Text size="sm" color={colors.pillText}>
                  {t(metric.helperKey)}
                </Text>
              </YStack>

              <YStack
                width={40}
                height={40}
                borderRadius={10}
                backgroundColor={itemBackground}
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={20} color={iconColor} />
              </YStack>
            </XStack>
          </Card>
        )
      })}
    </XStack>
  )
}
