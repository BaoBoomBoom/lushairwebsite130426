import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';

/** UI label + flag for the language picker (single source of truth) */
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '简体中文', flag: '🇨🇳' },
  'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ja: { name: '日本語', flag: '🇯🇵' },
  pt: { name: 'Português', flag: '🇵🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
} as const;

export type Language = keyof typeof LANGUAGES;

const STORAGE_KEY = 'lushair-language';

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const o = override[key];
    const b = result[key];
    if (isPlainObject(o) && isPlainObject(b)) {
      result[key] = deepMerge(b, o);
    } else if (o !== undefined) {
      result[key] = o;
    }
  }
  return result;
}

type LocaleModule = { default?: Record<string, unknown> } & Record<string, unknown>;

async function loadLocaleModule(lang: Exclude<Language, 'en'>): Promise<Record<string, unknown>> {
  switch (lang) {
    case 'zh':
      return ((await import('../locales/zh.json')) as LocaleModule).default ?? {};
    case 'zh-TW':
      return ((await import('../locales/zh-TW.json')) as LocaleModule).default ?? {};
    case 'de':
      return ((await import('../locales/de.json')) as LocaleModule).default ?? {};
    case 'fr':
      return ((await import('../locales/fr.json')) as LocaleModule).default ?? {};
    case 'ru':
      return ((await import('../locales/ru.json')) as LocaleModule).default ?? {};
    case 'ko':
      return ((await import('../locales/ko.json')) as LocaleModule).default ?? {};
    case 'ja':
      return ((await import('../locales/ja.json')) as LocaleModule).default ?? {};
    case 'pt':
      return ((await import('../locales/pt.json')) as LocaleModule).default ?? {};
    case 'es':
      return ((await import('../locales/es.json')) as LocaleModule).default ?? {};
  }
}

function readStoredLanguage(): Language {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s && s in LANGUAGES) return s as Language;
  } catch {
    /* ignore */
  }
  return 'en';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() =>
    typeof window !== 'undefined' ? readStoredLanguage() : 'en'
  );
  const [translations, setTranslations] = useState<Record<string, unknown>>({});

  const loadTranslations = useCallback(async (lang: Language) => {
    try {
      const enRaw = ((await import('../locales/en.json')) as LocaleModule).default ?? {};
      if (lang === 'en') {
        setTranslations(enRaw as Record<string, unknown>);
        return;
      }
      const localeRaw = await loadLocaleModule(lang as Exclude<Language, 'en'>);
      setTranslations(deepMerge(enRaw as Record<string, unknown>, localeRaw) as Record<string, unknown>);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}`, error);
      try {
        const enRaw = ((await import('../locales/en.json')) as LocaleModule).default ?? {};
        setTranslations(enRaw as Record<string, unknown>);
      } catch {
        setTranslations({});
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useMemo(
    () => (key: string): string => {
      const keys = key.split('.');
      let value: unknown = translations;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in (value as object)) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      if (typeof value === 'string') return value;
      return key;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
