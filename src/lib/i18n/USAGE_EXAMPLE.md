# Localization Usage Guide

## Using Translations in Components

### Client Components

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';

export function MyComponent() {
  const { locale } = useLanguage();
  const t = useTranslations(locale);

  return (
    <div>
      <h1>{t.common.home}</h1>
      <p>{t.nav.aboutUs}</p>
      <button>{t.common.submit}</button>
    </div>
  );
}
```

### Server Components

For server components, you'll need to pass the locale as a prop or get it from cookies/headers:

```tsx
import { useTranslations } from '@/lib/i18n';

export function MyServerComponent({ locale = 'en' }: { locale?: string }) {
  const t = useTranslations(locale as any);

  return (
    <div>
      <h1>{t.common.home}</h1>
    </div>
  );
}
```

## Available Translation Keys

- `nav.*` - Navigation items
- `about.*` - About Us section
- `topics.*` - Major topics
- `common.*` - Common UI elements
- `contentTypes.*` - Content type names
- `status.*` - Content status labels

## Adding New Translations

1. Add the key to all three translation files:
   - `src/lib/i18n/translations/en.ts`
   - `src/lib/i18n/translations/uz.ts`
   - `src/lib/i18n/translations/ru.ts`

2. Use the same structure in all files for consistency.
