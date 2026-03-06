/** Default theme (matches TamaguiProvider defaultTheme). Used for html[data-theme] in layout so autofill CSS applies on first paint. */
export const DEFAULT_THEME = 'light' as const;

export type ThemeName = 'light' | 'dark';
