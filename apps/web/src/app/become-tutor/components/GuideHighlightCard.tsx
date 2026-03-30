'use client'

import {
  ArrowRightLineIcon,
  ClockOutlineIcon,
  GrowthOutlineIcon,
  WalletOutlineIcon,
} from '@mezon-tutors/app/ui/icons'
import { type GuideHighlight, type GuideHighlightIconKey } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { H2 } from 'tamagui'

type GuideHighlightCardProps = {
  item: GuideHighlight
  isCompact: boolean
}

const HIGHLIGHT_ICON_BY_KEY: Record<GuideHighlightIconKey, typeof WalletOutlineIcon> = {
  setOwnRate: WalletOutlineIcon,
  teachAnytime: ClockOutlineIcon,
  growProfessionally: GrowthOutlineIcon,
}

export function GuideHighlightCard({ item, isCompact }: GuideHighlightCardProps) {
  const t = useTranslations('BecomeTutorGuide')
  const Icon = HIGHLIGHT_ICON_BY_KEY[item.iconKey]

  return (
    <YStack
      flex={1}
      minHeight={isCompact ? 220 : 252}
      padding={isCompact ? 16 : 18}
      borderRadius={20}
      borderWidth={1}
      borderColor="$myLessonsCardBorder"
      backgroundColor="$myLessonsCardBackground"
      shadowColor="$myLessonsCardBorder"
      shadowOpacity={0.12}
      shadowRadius={14}
      shadowOffset={{ width: 0, height: 10 }}
      gap="$3"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      group
      hoverStyle={{
        borderColor: '$myLessonsPrimaryButtonBorder',
        backgroundColor: '$myLessonsPrimaryButton',
        shadowColor: '$myLessonsPrimaryButton',
        shadowOpacity: 0.34,
        shadowRadius: 26,
        y: -2,
      }}
    >
      <YStack
        position="absolute"
        top={-34}
        right={-30}
        width={92}
        height={92}
        borderRadius={999}
        backgroundColor="rgba(30, 97, 243, 0.08)"
        $group-hover={{
          backgroundColor: 'rgba(255,255,255,0.14)',
        }}
      />

      <XStack
        width={32}
        height={32}
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(32, 107, 255, 0.12)"
        $group-hover={{
          backgroundColor: 'rgba(255,255,255,0.16)',
        }}
      >
        <Text
          color="#1D66F2"
          lineHeight={0}
          $group-hover={{
            color: '#F6FAFF',
          }}
        >
          <Icon color="currentColor" />
        </Text>
      </XStack>

      <H2
        color="$myLessonsHeaderTitle"
        fontSize={isCompact ? 30 : 38}
        lineHeight={isCompact ? 35 : 44}
        fontWeight="800"
        $group-hover={{
          color: '$myLessonsPrimaryButtonText',
        }}
      >
        {t(item.titleKey)}
      </H2>
      <Paragraph
        color="$myLessonsPromoDescription"
        fontSize={12}
        lineHeight={18}
        opacity={1}
        $group-hover={{
          color: '$myLessonsPrimaryButtonText',
          opacity: 0.92,
        }}
      >
        {t(item.descriptionKey)}
      </Paragraph>

      <YStack flex={1} />

      <XStack alignItems="center" justifyContent="space-between">
        <Text
          color="$myLessonsPrimaryButton"
          fontSize={9}
          letterSpacing={1.1}
          fontWeight="700"
          textTransform="uppercase"
          $group-hover={{
            color: '$myLessonsPrimaryButtonText',
          }}
        >
          {t(item.tagKey)}
        </Text>
        <Text
          color="$myLessonsPrimaryButton"
          lineHeight={0}
          $group-hover={{
            color: '$myLessonsPrimaryButtonText',
          }}
        >
          <ArrowRightLineIcon color="currentColor" />
        </Text>
      </XStack>
    </YStack>
  )
}

