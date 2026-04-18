export const TUTOR_DETAIL_TAB_KEYS = ['about', 'schedule', 'reviews', 'resources'] as const

export type TutorDetailTabKey = (typeof TUTOR_DETAIL_TAB_KEYS)[number]

export const [TUTOR_DETAIL_DEFAULT_TAB] = TUTOR_DETAIL_TAB_KEYS

export const TUTOR_DETAIL_WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export const TUTOR_DETAIL_DEFAULT_VISIBLE_REVIEW_COUNT = 5
