import { getRequestConfig } from 'next-intl/server';

export const locales = ['ro', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeNames: Record<Locale, string> = {
  ro: 'Română',
  en: 'English',
};

export default getRequestConfig(async ({ locale, requestLocale }) => {
  let resolvedLocale = locale;

  if ((!resolvedLocale || !isLocale(resolvedLocale)) && requestLocale) {
    try {
      const awaitedLocale = await requestLocale;
      if (awaitedLocale && isLocale(awaitedLocale)) {
        resolvedLocale = awaitedLocale;
      }
    } catch {
      resolvedLocale = undefined;
    }
  }

  if (!resolvedLocale || !isLocale(resolvedLocale)) {
    resolvedLocale = defaultLocale;
  }

  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages,
  };
});
