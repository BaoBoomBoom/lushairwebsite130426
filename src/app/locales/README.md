# Multi-Language System

## Available Languages

- **English (en)** - Default/Primary language 🇺🇸
- **简体中文 (zh)** - Simplified Chinese 🇨🇳
- **繁體中文 (zh-TW)** - Traditional Chinese 🇹🇼
- **한국어 (ko)** - Korean 🇰🇷
- **Español (es)** - Spanish 🇪🇸
- **Português (pt)** - Portuguese 🇵🇹
- **Русский (ru)** - Russian 🇷🇺
- **日本語 (ja)** - Japanese 🇯🇵
- **Polski (pl)** - Polish 🇵🇱
- **Français (fr)** - French 🇫🇷
- **Deutsch (de)** - German 🇩🇪
- **Italiano (it)** - Italian 🇮🇹

**Total: 12 languages supported**

## How to Use Translations

### In Components

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
    </div>
  );
}
```

### Translation Key Format

Translation keys use dot notation to access nested values:

```
t('section.subsection.key')
```

Example:
```
t('home.hero.title') → "Your Personal" (EN) / "您的专属" (ZH)
t('nav.home') → "Home" (EN) / "首页" (ZH)
```

### Adding New Translations

1. Add the key-value pair to `en.json` (primary language)
2. Add corresponding translations to `zh.json`, `ko.json`, and `es.json`
3. Use the key in your component with `t('your.new.key')`

Example:
```json
// en.json
{
  "features": {
    "newFeature": "This is a new feature"
  }
}

// zh.json
{
  "features": {
    "newFeature": "这是一个新功能"
  }
}
```

### Changing Language

Users can change language using the language selector in the header (globe icon).

Programmatically:
```typescript
const { setLanguage } = useLanguage();

setLanguage('zh');    // Switch to Simplified Chinese
setLanguage('zh-TW'); // Switch to Traditional Chinese
setLanguage('en');    // Switch to English
setLanguage('ko');    // Switch to Korean
setLanguage('es');    // Switch to Spanish
setLanguage('pt');    // Switch to Portuguese
setLanguage('ru');    // Switch to Russian
setLanguage('ja');    // Switch to Japanese
setLanguage('pl');    // Switch to Polish
setLanguage('fr');    // Switch to French
setLanguage('de');    // Switch to German
setLanguage('it');    // Switch to Italian
```

## File Structure

```
/src/app/locales/
├── en.json (English - Primary) 🇺🇸
├── zh.json (Simplified Chinese) 🇨🇳
├── zh-TW.json (Traditional Chinese) 🇹🇼
├── ko.json (Korean) 🇰🇷
├── es.json (Spanish) 🇪🇸
├── pt.json (Portuguese) 🇵🇹
├── ru.json (Russian) 🇷🇺
├── ja.json (Japanese) 🇯🇵
├── pl.json (Polish) 🇵🇱
├── fr.json (French) 🇫🇷
├── de.json (German) 🇩🇪
├── it.json (Italian) 🇮🇹
└── README.md (This file)
```

## Notes

- English is the fallback language if a translation is missing
- Translations are loaded dynamically based on the selected language
- The language preference is stored in component state (can be extended to localStorage)
- Basic translations are provided for navigation and home page sections
- All 12 languages have consistent translation structure for easy maintenance