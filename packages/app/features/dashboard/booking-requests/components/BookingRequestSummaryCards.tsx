import { useTranslations } from 'next-intl';
import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { ChartIcon, ClockCircleIcon, WalletOutlineIcon } from '@mezon-tutors/app/ui/icons';
import { useTheme } from 'tamagui';
import type { SummaryMetricViewModel, SummaryMetricKey } from '../types';

type BookingRequestSummaryCardsProps = {
  metrics: SummaryMetricViewModel[];
  isCompact: boolean;
};

type SummaryCardProps = {
  metric: SummaryMetricViewModel;
  isCompact: boolean;
};

function MetricIcon({ metricKey, color }: { metricKey: SummaryMetricKey; color?: string }) {
  if (metricKey === 'conversionRate') {
    return <ChartIcon size={18} color={color} />;
  }

  if (metricKey === 'responseTime') {
    return <ClockCircleIcon size={18} color={color} />;
  }

  return <WalletOutlineIcon size={18} color={color} />;
}

function SummaryCard({ metric, isCompact }: SummaryCardProps) {
  const t = useTranslations('Dashboard.bookingRequests');
  const theme = useTheme();
  const summaryAccentByMetric: Record<SummaryMetricKey, string | undefined> = {
    conversionRate: theme.dashboardTutorSummaryIconColor?.val,
    responseTime: theme.dashboardTutorStatusPendingText?.val,
    nextPayout: theme.dashboardTutorTextSecondary?.val,
  };
  const summaryIconColor = summaryAccentByMetric[metric.key];

  const summaryLabelTokenByMetric: Record<SummaryMetricKey, string> = {
    conversionRate: '$dashboardTutorSummaryIconColor',
    responseTime: '$dashboardTutorStatusPendingText',
    nextPayout: '$dashboardTutorTextSecondary',
  };
  const summaryLabelColor = summaryLabelTokenByMetric[metric.key];

  return (
    <YStack
      key={metric.key}
      flex={1}
      minWidth={isCompact ? '100%' : 240}
      borderWidth={1}
      borderColor="$dashboardTutorSummaryCardBorder"
      borderRadius={14}
      backgroundColor="$dashboardTutorSummaryCardBackground"
      padding="$4"
      gap="$2.5"
      style={{ boxShadow: '0 8px 24px rgba(3,10,26,0.18)' }}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text color={summaryLabelColor} fontSize={10} lineHeight={14} fontWeight="700" textTransform="uppercase" letterSpacing={0.8}>
          {t(`summary.${metric.key}`)}
        </Text>
        <YStack
          width={28}
          height={28}
          borderRadius={999}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$dashboardTutorSummaryIconBackground"
        >
          <MetricIcon metricKey={metric.key} color={summaryIconColor} />
        </YStack>
      </XStack>

      <Text color="$dashboardTutorTextPrimary" fontSize={38} lineHeight={42} fontWeight="800" letterSpacing={-1}>
        {metric.value}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={15} opacity={0.8}>
        {t(`summary.${metric.key}Hint`)}
      </Text>
    </YStack>
  );
}

export function BookingRequestSummaryCards({ metrics, isCompact }: BookingRequestSummaryCardsProps) {
  return (
    <XStack gap="$3" flexWrap="wrap" marginTop="$2">
      {metrics.map((metric) => (
        <SummaryCard key={metric.key} metric={metric} isCompact={isCompact} />
      ))}
    </XStack>
  );
}
