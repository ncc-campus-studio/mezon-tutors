import { Chip, ChipText, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { StarOutlineIcon, WorldIcon } from '@mezon-tutors/app/ui/icons'
import { TutorAboutDto, TUTOR_DETAIL_TAB_KEYS } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { Image, useMedia } from 'tamagui'
import { TutorDetailTab } from './types'

type TutorDetailHeaderProps = {
  tutor: TutorAboutDto
  activeTab: TutorDetailTab
  onTabChange: (tab: TutorDetailTab) => void
}

export function TutorDetailHeader({ tutor, activeTab, onTabChange }: TutorDetailHeaderProps) {
  const t = useTranslations('Tutors.Detail')
  const media = useMedia()
  const isStack = media.xs

  return (
    <YStack
      backgroundColor="$tutorsDetailCardBackground"
      borderWidth={1}
      borderColor="$tutorsDetailCardBorder"
      borderRadius={18}
      overflow="hidden"
    >
      <XStack
        gap="$3.5"
        padding="$4"
        flexDirection={isStack ? 'column' : 'row'}
        alignItems={isStack ? 'flex-start' : 'center'}
      >
        <Image
          src={tutor.avatar}
          width={72}
          height={72}
          borderRadius={12}
          borderWidth={1}
          borderColor="$tutorsDetailChipBorder"
          objectFit="cover"
        />

        <YStack flex={1} gap="$2" minWidth={0}>
          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            <Text color="$tutorsDetailPrimaryText" fontSize={24} fontWeight="800">
              {tutor.firstName} {tutor.lastName}
            </Text>
            {tutor.isProfessional && (
              <Chip
                tone="primary"
                backgroundColor="$tutorsDetailBadgeBackground"
                borderColor="$tutorsDetailBadgeBorder"
                borderWidth={1}
              >
                <ChipText tone="primary" color="$tutorsDetailBadgeText">
                  {t('professional')}
                </ChipText>
              </Chip>
            )}
          </XStack>

          <Text color="$tutorsDetailSecondaryText">
            {tutor.subject} • {tutor.headline || t('defaultHeadline')}
          </Text>

          <XStack alignItems="center" gap="$4" flexWrap="wrap">
            <XStack alignItems="center" gap="$1.5">
              <WorldIcon size={14} color="$tutorsDetailMetaIcon" />
              <Text color="$tutorsDetailSecondaryText">{tutor.country}</Text>
            </XStack>
            <XStack alignItems="center" gap="$1.5">
              <StarOutlineIcon size={14} color="$tutorsDetailAccentText" />
              <Text color="$tutorsDetailPrimaryText" fontWeight="700">
                {tutor.ratingAverage.toFixed(2)}
              </Text>
              <Text color="$tutorsDetailSecondaryText">
                {t('reviewsCount', { count: tutor.ratingCount })}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </XStack>

      <XStack
        borderTopWidth={1}
        borderColor="$tutorsDetailDivider"
        paddingHorizontal="$4"
        paddingVertical="$2.5"
        gap="$4"
        flexWrap="wrap"
      >
        {TUTOR_DETAIL_TAB_KEYS.map((tab) => {
          const isActive = tab === activeTab
          return (
            <YStack key={tab} gap="$1">
              <Text
                cursor="pointer"
                color={isActive ? '$tutorsDetailAccentText' : '$tutorsDetailSecondaryText'}
                fontWeight={isActive ? '700' : '500'}
                onPress={() => onTabChange(tab)}
              >
                {t(`tabs.${tab}`)}
              </Text>
              <YStack
                height={2}
                borderRadius={999}
                backgroundColor={isActive ? '$tutorsDetailAccentText' : 'transparent'}
              />
            </YStack>
          )
        })}
      </XStack>
    </YStack>
  )
}
