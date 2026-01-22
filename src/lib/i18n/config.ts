export const locales = ['uz', 'en', 'ru'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export const localeNames: Record<Locale, { name: string; flag: string }> = {
  uz: { name: 'O\'zbek', flag: '🇺🇿' },
  en: { name: 'English', flag: '🇬🇧' },
  ru: { name: 'Русский', flag: '🇷🇺' },
};
