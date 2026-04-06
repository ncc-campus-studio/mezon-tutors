import { createTokens } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';

export const tokens = createTokens({
  color: {
    // ===== Core Brand =====
    appPrimary: '#1253D5',
    appPrimaryHover: '#104BC4',

    // ===== Surfaces =====
    appBackground: '#f8f6f6',
    appBackgroundMuted: '#f1f5f9',
    appSurface: '#ffffff',

    // ===== Text =====
    appText: '#272A3C',
    appTextMuted: '#6B7280',

    // ===== Borders =====
    appBorder: '#D1D5DB',
    appBorderSubtle: '#E5E7EB',
    appBorderEmphasis: '#1253D5',

    // ===== Secondary / UI =====
    appSecondary: '#1152D41A',
    appShadow: '#0000000F',
    appWhiteSubtle: '#FFFFFFB3',
    appIconSubtle: '#6B7280',

    // ===== Web Header =====
    appWebHeaderBgStart: '#0B1628',
    appWebHeaderBgEnd: '#101F3F',
    appWebHeaderBorder: 'rgba(255, 255, 255, 0.1)',
    appWebHeaderLogoChipBg: 'rgba(255, 255, 255, 0.04)',
    appWebHeaderLogoChipBorder: 'rgba(121, 167, 255, 0.2)',
    appWebHeaderMenuShadow: 'rgba(2, 8, 20, 0.42)',
    appWebHeaderAvatarGradientStart: '#667EEA',
    appWebHeaderAvatarGradientEnd: '#764BA2',

    // ===== Home =====
    appHomePageBackground: '#0A1628',
    appHomeHeroBackground: '#0F2F6D',
    appHomeHeroSurface: '#1A3A7D',
    appHomeHeroText: '#FFFFFF',
    appHomeHeroTextMuted: '#C5D6F6',
    appHomeFeatureSectionBackground: '#0D1B35',
    appHomeFeatureCardBackground: '#152642',
    appHomeFeatureCardBorder: '#1E3A5F',
    appHomeFeatureText: '#E5E7EB',
    appHomeFeatureCardText: '#B8C5D9',
    appHomeFeatureIconBackground: '#1A3A7D',
    appHomeFeatureIconBorder: '#2F5A9E',
    appHomeFeatureExploreBorder: '#2F5A9E',
    appHomeFeatureExploreBackground: 'rgba(18, 83, 213, 0.1)',
    appHomeStatsBackground: '#1253D5',
    appHomeSeamlessBackground: '#0A1628',
    appHomeSeamlessSurface: '#152642',
    appHomeSeamlessBorder: '#1E3A5F',
    appHomeSeamlessIconBackground: 'rgba(18, 83, 213, 0.2)',

    // ===== State =====
    appSuccess: '#13e17a',
    appSuccessBackground: '#f0fdf4',

    appPillBackground: '#f3f4f5',
    appSelectedBackground: '#F1F1FF',
    appUnselectedBackground: '#F4F5F7',

    // ===== Red scale =====
    red1: '#fef2f2',
    red2: '#fee2e2',
    red3: '#fecaca',
    red4: '#f87171',
    red6: '#dc2626',
    red8: '#b91c1c',
    red9: '#991b1b',
    red10: '#dc2626', // validation/error text
    red11: '#7f1d1d',
    red12: '#450a0a',

    // ===== Blue scale =====
    blue1: '#f0f9ff',
    blue2: '#e0f2fe',
    blue3: '#bae6fd',
    blue4: '#38bdf8',
    blue6: '#0284c7',
    blue8: '#0369a1',
    blue9: '#075985',
    blue11: '#0c4a6e',
    blue12: '#082f49',

    // ===== Green scale =====
    green1: '#f0fdf4',
    green2: '#dcfce7',
    green3: '#bbf7d0',
    green4: '#4ade80',
    green6: '#16a34a',
    green8: '#15803d',
    green9: '#166534',
    green11: '#14532d',
    green12: '#052e16',

    // ===== My Lessons =====
    myLessonsCardBorder: 'rgba(20, 44, 89, 0.9)',
    myLessonsCardBackground: '#08142D',
    myLessonsCalendarTitle: '#EDF3FF',
    myLessonsMonthNav: '#7F93BD',
    myLessonsSwitcherBackground: '#13233F',
    myLessonsSwitcherBorder: 'rgba(255, 255, 255, 0.06)',
    myLessonsSwitcherActiveBackground: '#40577F',
    myLessonsSwitcherActiveText: '#F6FAFF',
    myLessonsSwitcherInactiveText: '#8EA4CE',
    myLessonsLegendText: '#8DA3CD',
    myLessonsFooterText: '#7E93BE',
    myLessonsGridHeaderBackground: '#0A142D',
    myLessonsGridBodyBackground: '#091327',
    myLessonsGridBorder: 'rgba(20, 44, 89, 0.9)',
    myLessonsDayLabel: '#96A7CC',
    myLessonsActiveDate: '#2F7CFF',
    myLessonsInactiveDate: '#E8EEFE',
    myLessonsActiveDayColumn: 'rgba(18, 43, 90, 0.7)',
    myLessonsCurrentColumn: 'rgba(16, 42, 94, 0.45)',
    myLessonsCurrentColumnGap: 'rgba(16, 42, 94, 0.3)',
    myLessonsGapCellBackground: 'rgba(9, 19, 39, 0.75)',
    myLessonsTimeLabel: '#7F93BD',
    myLessonsNowLine: '#2F7CFF',
    myLessonsGapLabel: '#7389B5',
    myLessonsGapHint: '#5A709C',
    myLessonsEventBorder: 'rgba(255, 255, 255, 0.08)',
    myLessonsEventTutor: '#DDE6FD',
    myLessonsEventTime: '#9FB2DC',
  },

  radius: {
    ...defaultConfig.tokens.radius,
    appCard: 20,
    appPill: 999,
    homeFeatureCard: 22,
    homeSeamlessCard: 20,
    homeStatsBadge: 14,
    homeHeroCard: 26,
    homeHeroButton: 20,
  },
  size: {
    ...defaultConfig.tokens.size,
    homeFeatureIcon: 96,
    homeSeamlessIcon: 48,
    homeSeamlessIconImage: 24,
    homeBenefitDot: 10,
    homeHeroFlashIcon: 16,
    homeHeroVideoPlayIcon: 44,
  },
  space: {
    ...defaultConfig.tokens.space,
    homeFeatureCardPaddingCompact: 26,
    homeFeatureCardPadding: 34,
    homeFeatureIconMargin: 24,
    homeFeatureCardGap: 24,
    homeSeamlessCardPadding: 28,
    homeSeamlessCardGap: 22,
    homeSeamlessCardInnerGap: 18,
    homeStatsBenefitGap: 13,
    homeStatsBenefitItemGap: 12,
  },
  zIndex: defaultConfig.tokens.zIndex,
});
