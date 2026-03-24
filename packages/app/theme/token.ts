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
  },
  size: defaultConfig.tokens.size,
  space: defaultConfig.tokens.space,
  zIndex: defaultConfig.tokens.zIndex,
});
