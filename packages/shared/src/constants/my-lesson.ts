export const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

export const MY_LESSONS_MOBILE_CONFIG = {
  weekDay: {
    minWidth: 44,
    maxWidth: 44,
    width: 44,
    padding: {
      vertical: 26,
      horizontal: 4,
    },
    contentGap: 0,
    borderRadius: 12,
    dayFontSize: 9,
    dayLineHeight:9,
    dateFontSize: 15,
    dateLineHeight: 9,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    gap: 8,
    avatar: {
      size: 40,
      borderRadius: 999,
    },
    subject: {
      fontSize: 13,
      lineHeight: 16,
    },
    tutor: {
      fontSize: 11,
      lineHeight: 14,
    },
    time: {
      fontSize: 10,
      lineHeight: 14,
      iconSize: 11,
    },
    button: {
      fontSize: 11,
      borderRadius: 7,
      padding: {
        vertical: 7,
        horizontal: 12,
      },
    },
  },
  category: {
    dotSize: 6,
    fontSize: 11,
    padding: {
      horizontal: 10,
      vertical: 4,
    },
    borderRadius: 16,
  },
  navigation: {
    iconSize: 16,
    buttonPadding: 4,
    buttonBorderRadius: 6,
    titleFontSize: 13,
  },
  empty: {
    minHeight: 120,
    borderRadius: 10,
    padding: 12,
    fontSize: 11,
  },
} as const;
