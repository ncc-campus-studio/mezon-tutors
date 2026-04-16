import { Text, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { getStatusLabelKey, getStatusTokenName, MY_SCHEDULE_EVENT_CARD_CONFIG } from '@mezon-tutors/shared';
import type { ScheduleItem } from '../types';

type MyScheduleEventCardProps = {
  schedule: ScheduleItem;
  isCompact: boolean;
  onPress?: () => void;
};

export function MyScheduleEventCard({ schedule, isCompact, onPress }: MyScheduleEventCardProps) {
  const t = useTranslations('MySchedule.legend');
  const [startTime = '', endTime = ''] = schedule.timeLabel.split(' - ');
  const isAvailable = schedule.status === 'available';
  const displayTitle = isAvailable ? t(getStatusLabelKey(schedule.status)).toUpperCase() : schedule.title;

  const config = MY_SCHEDULE_EVENT_CARD_CONFIG;
  const sizeConfig = isAvailable 
    ? (isCompact ? config.available.compact : config.available.normal)
    : (isCompact ? config.event.compact : config.event.normal);

  const bgToken = getStatusTokenName(schedule.status, 'Bg');
  const labelToken = getStatusTokenName(schedule.status, 'Label');
  const dotToken = getStatusTokenName(schedule.status, 'Dot');

  return (
    <YStack
      width="100%"
      height="100%"
      maxWidth="100%"
      minWidth={0}
      borderRadius={config.borderRadius}
      backgroundColor={bgToken}
      borderWidth={1}
      borderColor={isAvailable ? dotToken : '$myScheduleEventBorder'}
      borderStyle={isAvailable ? 'dashed' : 'solid'}
      borderLeftWidth={isAvailable ? 1 : config.borderLeftWidth}
      borderLeftColor={dotToken}
      padding={isCompact ? '$1.5' : '$2'}
      gap={4}
      justifyContent="center"
      alignItems={isAvailable ? 'center' : 'flex-start'}
      minHeight={sizeConfig.minHeight}
      maxHeight={'maxHeight' in sizeConfig ? sizeConfig.maxHeight : undefined}
      overflow="hidden"
      cursor={isAvailable ? 'default' : 'pointer'}
      hoverStyle={isAvailable ? {} : { opacity: 0.8 }}
      onPress={isAvailable ? undefined : onPress}
    >
      {!isAvailable && 'timeFontSize' in sizeConfig && (
        <Text 
          color={labelToken} 
          fontSize={sizeConfig.timeFontSize} 
          lineHeight={sizeConfig.timeLineHeight} 
          fontWeight="600" 
          numberOfLines={1}
        >
          {startTime} - {endTime}
        </Text>
      )}

      <Text
        color={labelToken}
        fontSize={sizeConfig.fontSize}
        lineHeight={sizeConfig.lineHeight}
        fontWeight="700"
        numberOfLines={isAvailable ? 3 : 2}
        textAlign={isAvailable ? 'center' : 'left'}
        letterSpacing={isAvailable ? 0.6 : 0}
      >
        {displayTitle}
      </Text>
    </YStack>
  );
}
