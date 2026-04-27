import { Text, YStack, XStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';

export function WeeklyInsight() {
  const t = useTranslations('MySchedule.sidebar');

  return (
    <YStack
      backgroundColor="$dashboardTutorCardBackground"
      borderRadius={16}
      borderWidth={1}
      borderColor="$dashboardTutorCardBorder"
      padding="$4"
      gap="$3"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={16} fontWeight="700" color="$dashboardTutorTextPrimary">
          {t('weeklyInsight')}
        </Text>
        <Text fontSize={20} color="$dashboardTutorTextSecondary">*</Text>
      </XStack>

      <Text fontSize={13} color="$dashboardTutorTextSecondary" lineHeight={20}>
        {t('insightDescription')}
      </Text>

      <YStack gap="$2" marginTop="$2">
        <Text fontSize={12} fontWeight="600" color="$dashboardTutorTextSecondary">
          {t('hoursTaught')}
        </Text>
        <XStack alignItems="center" gap="$2">
          <YStack flex={1} height={6} backgroundColor="rgba(47, 124, 255, 0.16)" borderRadius={3}>
            <YStack width="72%" height="100%" backgroundColor="$dashboardTutorFilterActiveBg" borderRadius={3} />
          </YStack>
          <Text fontSize={14} fontWeight="700" color="$dashboardTutorTextPrimary">
            18/25
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
