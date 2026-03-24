import type { LessonCategory } from './types';

export type CategoryTheme = {
  background: string;
  label: string;
  dot: string;
};

const ENGLISH_THEME: CategoryTheme = {
  background: '$myLessonsCategoryEnglishBackground',
  label: '$myLessonsCategoryEnglishLabel',
  dot: '$myLessonsCategoryEnglishDot',
};

export function getCategoryKey(category: LessonCategory): string {
  const key = category
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return key || 'other';
}

export function getCategoryTheme(_category: LessonCategory): CategoryTheme {
  return ENGLISH_THEME;
}

export function getCategoryLabel(category: LessonCategory, suffix = 'Lessons'): string {
  const key = getCategoryKey(category);

  return `${key
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')} ${suffix}`;
}
