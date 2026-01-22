import { Locale } from './config';
import { en } from './translations/en';
import { uz } from './translations/uz';
import { ru } from './translations/ru';

export type Translations = typeof en;

const translations = {
  en,
  uz,
  ru,
} as const;

export function getTranslations(locale: Locale = 'en'): Translations {
  return translations[locale] || translations.en;
}

export function useTranslations(locale: Locale = 'en') {
  return getTranslations(locale);
}
