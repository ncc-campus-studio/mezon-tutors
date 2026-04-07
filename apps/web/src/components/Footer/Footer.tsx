'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES, FOOTER_COLUMNS, FOOTER_SOCIALS } from '@mezon-tutors/shared';
import { XStack, YStack, Text, useMedia } from '@mezon-tutors/app/ui';
import { AtSignIcon, GlobeIcon, LogoIcon } from '@mezon-tutors/app/ui/icons';
import FooterSocialButton from './FooterSocialButton';
import FooterLinkColumn from './FooterLinkColumn';

const FOOTER_SOCIAL_ICON_COMPONENTS = {
  globe: GlobeIcon,
  atSign: AtSignIcon,
} as const;

export default function Footer() {
  const t = useTranslations('Common.Footer');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  return (
    <YStack
      backgroundColor="$myLessonsTopNavBackground"
      borderTopWidth={1}
      borderTopColor="$myLessonsTopNavBorder"
      paddingTop={isCompact ? 40 : 68}
      paddingBottom={isCompact ? 28 : 36}
      paddingHorizontal={isCompact ? 20 : 64}
      gap={isCompact ? 28 : 44}
    >
      <XStack
        maxWidth={1400}
        width="100%"
        alignSelf="center"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={isCompact ? 28 : 42}
      >
        <YStack flexGrow={1} flexBasis={isCompact ? '100%' : 320} maxWidth={420} gap="$4">
          <Link href={ROUTES.HOME.index} style={{ color: 'inherit', textDecoration: 'none' }}>
            <XStack alignItems="center" gap="$2.5">
              <LogoIcon width={32} height={32} />
              <Text color="$myLessonsHeaderTitle" fontSize={24} fontWeight="800" lineHeight={30}>
                TutorMatch
              </Text>
            </XStack>
          </Link>

          <Text color="$myLessonsPromoDescription" fontSize={15} lineHeight={24} maxWidth={340}>
            {t('description')}
          </Text>

          <XStack gap="$2.5">
            {FOOTER_SOCIALS.map((social) => (
              <FooterSocialButton
                key={social.iconKey}
                social={social}
                Icon={FOOTER_SOCIAL_ICON_COMPONENTS[social.iconKey]}
              />
            ))}
          </XStack>
        </YStack>

        {FOOTER_COLUMNS.map((column) => (
          <FooterLinkColumn key={column.titleKey} column={column} isCompact={isCompact} />
        ))}
      </XStack>

      <XStack
        maxWidth={1400}
        width="100%"
        alignSelf="center"
        borderTopWidth={1}
        borderTopColor="$myLessonsTopNavBorder"
        paddingTop={isCompact ? 18 : 24}
        flexDirection={isCompact ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isCompact ? 'flex-start' : 'center'}
        gap={isCompact ? 12 : 20}
      >
        <Text color="$myLessonsPromoDescription" fontSize={13} lineHeight={20}>
          {t('copyright')}
        </Text>

        <XStack gap="$5">
          <Link href={ROUTES.HOME.index} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Text color="$myLessonsPromoDescription" fontSize={13} lineHeight={20} hoverStyle={{ color: '$myLessonsPrimaryButton' }}>
              {t('bottom.terms')}
            </Text>
          </Link>
          <Link href={ROUTES.HOME.index} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Text color="$myLessonsPromoDescription" fontSize={13} lineHeight={20} hoverStyle={{ color: '$myLessonsPrimaryButton' }}>
              {t('bottom.privacy')}
            </Text>
          </Link>
        </XStack>
      </XStack>
    </YStack>
  );
}
