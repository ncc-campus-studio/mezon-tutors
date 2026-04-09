'use client';

import { useTranslations } from 'next-intl';
import { Screen, Text, YStack } from '@mezon-tutors/app/ui';

export default function DashboardMySchedulePage() {
  const t = useTranslations('Dashboard.placeholder');

  return (
    <Screen backgroundColor="$dashboardTutorPageBackground">
      <YStack
        width="100%"
        maxWidth={980}
        marginHorizontal="auto"
        borderWidth={1}
        borderColor="$dashboardTutorCardBorder"
        borderRadius={16}
        backgroundColor="$dashboardTutorCardBackground"
        padding="$5"
        gap="$2"
      >
        <Text color="$dashboardTutorTextPrimary" fontSize={30} lineHeight={34} fontWeight="800">
          {t('title')}
        </Text>
        <Text color="$dashboardTutorTextSecondary" fontSize={14} lineHeight={20}>
          {t('description')}
        </Text>
      </YStack>
    </Screen>
  );
}
