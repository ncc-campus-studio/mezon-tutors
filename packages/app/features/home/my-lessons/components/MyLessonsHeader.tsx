import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import type { MyLessonsTab } from '../types';

type MyLessonsHeaderProps = {
  activeTab: MyLessonsTab;
  onTabChange: (tab: MyLessonsTab) => void;
};

const TAB_ITEMS: { value: MyLessonsTab; label: string }[] = [
  { value: 'lessons', label: 'header.tabs.lessons' },
  { value: 'calendar', label: 'header.tabs.calendar' },
  { value: 'tutors', label: 'header.tabs.tutors' },
];

export function MyLessonsHeader({ activeTab, onTabChange }: MyLessonsHeaderProps) {
  const t = useTranslations('MyLessons');

  return (
    <YStack gap="$4">
      <XStack
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        gap="$3"
        $xs={{ alignItems: 'flex-start', flexDirection: 'column' }}
        $sm={{ alignItems: 'flex-start', flexDirection: 'column' }}
        $md={{ alignItems: 'flex-start', flexDirection: 'column' }}
      >
        <Text
          color="$myLessonsHeaderTitle"
          fontSize={52}
          lineHeight={56}
          fontWeight="800"
          $xs={{ fontSize: 38, lineHeight: 42 }}
          $sm={{ fontSize: 38, lineHeight: 42 }}
          $md={{ fontSize: 38, lineHeight: 42 }}
        >
          {t('header.title')}
        </Text>

        <Button
          variant="primary"
          backgroundColor="$myLessonsPrimaryButton"
          borderColor="$myLessonsPrimaryButtonBorder"
          hoverStyle={{
            backgroundColor: '$myLessonsPrimaryButtonHover',
            borderColor: '$myLessonsPrimaryButtonHover',
          }}
          color="$myLessonsPrimaryButtonText"
          paddingHorizontal="$5"
          alignSelf="auto"
          $xs={{ alignSelf: 'stretch' }}
          $sm={{ alignSelf: 'stretch' }}
          $md={{ alignSelf: 'stretch' }}
        >
          {t('header.scheduleLesson')}
        </Button>
      </XStack>

      <XStack
        width="100%"
        borderBottomWidth={1}
        borderBottomColor="$myLessonsHeaderDivider"
        alignItems="flex-end"
        gap="$4"
        flexWrap="wrap"
      >
        {TAB_ITEMS.map((item) => {
          const isActive = item.value === activeTab;

          return (
            <YStack
              key={item.value}
              onPress={() => onTabChange(item.value)}
              paddingVertical="$2"
              borderBottomWidth={2}
              borderBottomColor={isActive ? '$myLessonsNavActive' : 'transparent'}
              cursor="pointer"
            >
              <Text
                fontSize={14}
                fontWeight={isActive ? '700' : '500'}
                color={isActive ? '$myLessonsNavActive' : '$myLessonsNavInactive'}
              >
                {t(item.label)}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </YStack>
  );
}
