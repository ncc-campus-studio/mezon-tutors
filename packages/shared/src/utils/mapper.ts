import { ETutorSortBy } from '../enums/filters'
import { ECountry, ELanguage, ESubject } from '../enums/tutor-profile'

export const SortByLabel: Record<ETutorSortBy, string> = {
  [ETutorSortBy.POPULARITY]: 'Popularity',
  [ETutorSortBy.TOP_PICKS]: 'Top Picks',
  [ETutorSortBy.HIGHEST_PRICE]: 'Highest Price',
  [ETutorSortBy.LOWEST_PRICE]: 'Lowest Price',
  [ETutorSortBy.NUMBER_OF_REVIEWS]: 'Number of Reviews',
  [ETutorSortBy.BEST_RATING]: 'Best Rating',
}

export const LanguageLabel: Record<ELanguage, string> = {
  [ELanguage.ANY_LANGUAGE]: 'Any language',
  [ELanguage.ENGLISH]: 'English',
  [ELanguage.VIETNAMESE]: 'Vietnamese',
  [ELanguage.CHINESE_MANDARIN]: 'Chinese (Mandarin)',
  [ELanguage.CHINESE_CANTONESE]: 'Chinese (Cantonese)',
  [ELanguage.SPANISH]: 'Spanish',
  [ELanguage.FRENCH]: 'French',
  [ELanguage.GERMAN]: 'German',
  [ELanguage.JAPANESE]: 'Japanese',
  [ELanguage.KOREAN]: 'Korean',
  [ELanguage.PORTUGUESE]: 'Portuguese',
  [ELanguage.ITALIAN]: 'Italian',
  [ELanguage.RUSSIAN]: 'Russian',
  [ELanguage.ARABIC]: 'Arabic',
  [ELanguage.HINDI]: 'Hindi',
  [ELanguage.THAI]: 'Thai',
  [ELanguage.INDONESIAN]: 'Indonesian',
  [ELanguage.DUTCH]: 'Dutch',
  [ELanguage.POLISH]: 'Polish',
  [ELanguage.TURKISH]: 'Turkish',
}

export const SubjectLabel: Record<ESubject, string> = {
  [ESubject.ANY_SUBJECT]: 'Any subject',
  [ESubject.ENGLISH]: 'English',
  [ESubject.MATH]: 'Math',
  [ESubject.SCIENCE]: 'Science',
  [ESubject.HISTORY]: 'History',
  [ESubject.SPANISH]: 'Spanish',
  [ESubject.FRENCH]: 'French',
  [ESubject.GERMAN]: 'German',
  [ESubject.JAPANESE]: 'Japanese',
  [ESubject.KOREAN]: 'Korean',
  [ESubject.VIETNAMESE]: 'Vietnamese',
}

export const CountryLabel: Record<ECountry, string> = {
  [ECountry.ANY_COUNTRY]: 'Any country',
  [ECountry.VIETNAM]: 'Vietnam',
  [ECountry.UNITED_STATES]: 'United States',
  [ECountry.UNITED_KINGDOM]: 'United Kingdom',
  [ECountry.AUSTRALIA]: 'Australia',
  [ECountry.CANADA]: 'Canada',
  [ECountry.INDIA]: 'India',
  [ECountry.SINGAPORE]: 'Singapore',
  [ECountry.PHILIPPINES]: 'Philippines',
}
