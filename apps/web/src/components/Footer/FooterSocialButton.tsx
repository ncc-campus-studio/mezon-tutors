'use client';

import { YStack } from '@mezon-tutors/app/ui';
import { themes } from '@mezon-tutors/app/theme/theme';
import { useTranslations } from 'next-intl';
import { useThemeName } from 'tamagui';
import type { FooterSocialConfig } from '@mezon-tutors/shared';
import { FOOTER_SOCIAL_ICON_COMPONENTS } from './constants';

type FooterSocialButtonProps = {
  social: FooterSocialConfig;
};

export default function FooterSocialButton({ social }: FooterSocialButtonProps) {
  const t = useTranslations('Common.Footer');
  const themeName = useThemeName();
  const activeTheme = themeName === 'dark' ? themes.dark : themes.light;
  const Icon = FOOTER_SOCIAL_ICON_COMPONENTS[social.iconKey];

  return (
    <YStack
      width={40}
      height={40}
      alignItems="center"
      justifyContent="center"
      borderRadius={12}
      borderWidth={1}
      borderColor="$myLessonsTopNavBorder"
      backgroundColor="$myLessonsCardBackground"
      style={{ transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)' }}
      hoverStyle={{ y: -2, borderColor: '$myLessonsPrimaryButton' }}
    >
      <Icon color={activeTheme.myLessonsSidebarIconInactive} width={20} height={20} aria-label={t(social.altKey as never)} />
    </YStack>
  );
}
