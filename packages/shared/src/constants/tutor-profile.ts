/**
 * Tutor profile about-step constants.
 * English only for now / Chỉ hỗ trợ tiếng Anh hiện tại.
 * Có thể mở rộng đa ngôn ngữ sau.
 */

/** Countries (display names in English). */
export const ABOUT_COUNTRIES = [
  'Vietnam',
  'United States',
  'United Kingdom',
  'Australia',
  'Canada',
  'India',
  'Singapore',
  'Philippines',
  'Other',
] as const;

/** Subjects to teach. Default/focus: English only. Có thể thêm môn khác sau. */
export const ABOUT_SUBJECTS = ['English'] as const;

/** Languages spoken (display names in English). */
export const ABOUT_LANGUAGES = [
  'English',
  'Vietnamese',
  'Chinese (Mandarin)',
  'Chinese (Cantonese)',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Portuguese',
  'Italian',
  'Russian',
  'Arabic',
  'Hindi',
  'Thai',
  'Indonesian',
  'Dutch',
  'Polish',
  'Turkish',
  'Other',
] as const;

/** Parse stored languages string (comma-separated) to array. */
export function parseLanguagesString(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Join languages array to stored string. */
export function joinLanguagesArray(languages: string[]): string {
  return languages.filter(Boolean).join(', ');
}

/** Parse stored proficiencies string (comma-separated) to array. */
export function parseProficienciesString(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Join proficiencies array to stored string. */
export function joinProficienciesArray(proficiencies: string[]): string {
  return proficiencies.filter(Boolean).join(', ');
}

/** Language proficiency levels (English labels). */
export const ABOUT_PROFICIENCY_LEVELS = [
  'Native',
  'Near-Native',
  'Fluent',
  'Advanced',
  'Upper-Intermediate',
  'Intermediate',
  'Elementary',
  'Basic',
  'Beginner',
] as const;
