import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const LOCALE_KEY = 'fish-locale';
export type Locale = 'ru' | 'en';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'ru') return stored;
  } catch {
    // ignore
  }
  return 'ru';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(() => setLocaleState((prev) => (prev === 'ru' ? 'en' : 'ru')), []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
