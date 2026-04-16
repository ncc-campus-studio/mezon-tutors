import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { X, Clock, User, BookOpen } from '@tamagui/lucide-icons';
import { getStatusLabelKey, getStatusTokenName } from '@mezon-tutors/shared';
import type { ScheduleItem } from '../types';

type LessonDetailModalProps = {
  lesson: ScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function LessonDetailModal({ lesson, isOpen, onClose }: LessonDetailModalProps) {
  const t = useTranslations('MySchedule.modal');
  const tLegend = useTranslations('MySchedule.legend');

  if (!isOpen || !lesson) return null;

  const bgToken = getStatusTokenName(lesson.status, 'Bg');
  const dotToken = getStatusTokenName(lesson.status, 'Dot');
  const badgeTextToken = getStatusTokenName(lesson.status, 'BadgeText');

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$myScheduleModalOverlay"
      onPress={onClose}
      style={{ position: 'fixed' } as any}
    >
      <YStack
        width="90%"
        maxWidth={520}
        backgroundColor="$myScheduleModalBackground"
        borderRadius={20}
        borderWidth={1}
        borderColor="$myScheduleModalBorder"
        overflow="hidden"
        onPress={(e) => e.stopPropagation()}
      >
        <YStack
          backgroundColor={bgToken}
          padding="$5"
          borderBottomWidth={1}
          borderBottomColor="$myScheduleModalBorder"
        >
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack gap="$2" flex={1}>
              <Text
                color="$myScheduleModalTitle"
                fontSize={24}
                lineHeight={32}
                fontWeight="700"
              >
                {lesson.title}
              </Text>
              <XStack gap="$2" alignItems="center">
                <YStack
                  paddingHorizontal="$2.5"
                  paddingVertical="$1.5"
                  borderRadius={8}
                  backgroundColor={dotToken}
                >
                  <Text
                    color={badgeTextToken}
                    fontSize={11}
                    lineHeight={14}
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    {tLegend(getStatusLabelKey(lesson.status))}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
            <YStack
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$myScheduleModalBorder"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              hoverStyle={{ backgroundColor: '$myScheduleModalCloseHover', opacity: 0.8 }}
              onPress={onClose}
            >
              <X size={20} color="$myScheduleModalCloseIcon" />
            </YStack>
          </XStack>
        </YStack>

        <YStack padding="$5" gap="$4">
          <XStack gap="$3" alignItems="center">
            <YStack
              width={40}
              height={40}
              borderRadius={12}
              backgroundColor="$myScheduleModalBorder"
              justifyContent="center"
              alignItems="center"
            >
              <Clock size={20} color="$myScheduleModalLabel" />
            </YStack>
            <YStack flex={1} gap="$1">
              <Text
                color="$myScheduleModalLabel"
                fontSize={12}
                lineHeight={16}
                fontWeight="500"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                {t('time')}
              </Text>
              <Text
                color="$myScheduleModalValue"
                fontSize={16}
                lineHeight={22}
                fontWeight="600"
              >
                {lesson.timeLabel}
              </Text>
            </YStack>
          </XStack>

          {lesson.studentName && (
            <XStack gap="$3" alignItems="center">
              <YStack
                width={40}
                height={40}
                borderRadius={12}
                backgroundColor="$myScheduleModalBorder"
                justifyContent="center"
                alignItems="center"
              >
                <User size={20} color="$myScheduleModalLabel" />
              </YStack>
              <YStack flex={1} gap="$1">
                <Text
                  color="$myScheduleModalLabel"
                  fontSize={12}
                  lineHeight={16}
                  fontWeight="500"
                  textTransform="uppercase"
                  letterSpacing={0.5}
                >
                  {t('student')}
                </Text>
                <Text
                  color="$myScheduleModalValue"
                  fontSize={16}
                  lineHeight={22}
                  fontWeight="600"
                >
                  {lesson.studentName}
                </Text>
              </YStack>
            </XStack>
          )}

          <XStack gap="$3" alignItems="center">
            <YStack
              width={40}
              height={40}
              borderRadius={12}
              backgroundColor="$myScheduleModalBorder"
              justifyContent="center"
              alignItems="center"
            >
              <BookOpen size={20} color="$myScheduleModalLabel" />
            </YStack>
            <YStack flex={1} gap="$1">
              <Text
                color="$myScheduleModalLabel"
                fontSize={12}
                lineHeight={16}
                fontWeight="500"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                {t('subject')}
              </Text>
              <Text
                color="$myScheduleModalValue"
                fontSize={16}
                lineHeight={22}
                fontWeight="600"
              >
                {lesson.title}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
