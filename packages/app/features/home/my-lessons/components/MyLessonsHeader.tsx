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
    <YStack
      gap="$4"
      $xs={{ gap: '$3' }}
      $sm={{ gap: '$3' }}
    >
      <XStack
        width="100%"
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection="row"
        flexWrap="nowrap"
        gap="$2"
        $xs={{ gap: '$1.5', alignItems: 'flex-start' }}
      >
        <Text
          color="$myLessonsHeaderTitle"
          fontSize={52}
          lineHeight={56}
          fontWeight="800"
          flex={1}
          flexShrink={1}
          $xs={{ fontSize: 18, lineHeight: 22, fontWeight: '700' }}
          $sm={{ fontSize: 24, lineHeight: 28, fontWeight: '700' }}
          $md={{ fontSize: 38, lineHeight: 42 }}
          className="my-lessons-title-mobile"
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
          paddingVertical="$3"
          flexShrink={0}
          $xs={{
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 6,
            minWidth: 'auto',
          }}
          $sm={{
            paddingHorizontal: '$2',
            paddingVertical: '$1.5',
            borderRadius: 8,
          }}
        >
          <Text
            color="$myLessonsPrimaryButtonText"
            fontSize={15}
            fontWeight="600"
            $xs={{ fontSize: 9, lineHeight: 11 }}
            $sm={{ fontSize: 11, lineHeight: 14 }}
          >
            {t('header.scheduleLesson')}
          </Text>
        </Button>
      </XStack>

      <XStack
        width="100%"
        borderBottomWidth={1}
        borderBottomColor="$myLessonsHeaderDivider"
        alignItems="flex-end"
        gap="$4"
        flexWrap="wrap"
        role="tablist"
        $xs={{ gap: '$3' }}
        $sm={{ gap: '$3' }}
      >
        {TAB_ITEMS.map((item) => {
          const isActive = item.value === activeTab;

          return (
            <Button
              chromeless
              key={item.value}
              onPress={() => onTabChange(item.value)}
              paddingVertical="$2"
              borderBottomWidth={2}
              borderBottomColor={isActive ? '$myLessonsNavActive' : 'transparent'}
              borderRadius={0}
              alignItems="flex-start"
              aria-selected={isActive}
              role="tab"
              $xs={{ paddingVertical: '$1.5' }}
              $sm={{ paddingVertical: '$1.5' }}
            >
              <Text
                fontSize={14}
                fontWeight={isActive ? '700' : '500'}
                color={isActive ? '$myLessonsNavActive' : '$myLessonsNavInactive'}
                $xs={{ fontSize: 13 }}
                $sm={{ fontSize: 13 }}
              >
                {t(item.label)}
              </Text>
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
}
