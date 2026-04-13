# LUSHAIR Multi-Language Implementation Guide

## Current Status

✅ **Completed:**
- Language Context system (`/src/app/contexts/LanguageContext.tsx`)
- Header component with language selector (12 languages)
- Complete translation files for:
  - English (en.json) - ✅ Complete (all pages)
  - Simplified Chinese (zh.json) - ✅ Complete (all pages)  
  - Traditional Chinese (zh-TW.json) - ✅ Complete (all pages)
  - Portuguese (pt.json) - ✅ Complete (all pages)

⚠️ **In Progress:**
- Translation files for: Russian, Japanese, Polish, French, German, Italian, Korean, Spanish
- Component integration for all pages

## 12 Supported Languages

1. 🇺🇸 English (en) - Default
2. 🇨🇳 Simplified Chinese (zh)
3. 🇹🇼 Traditional Chinese (zh-TW)
4. 🇰🇷 Korean (ko)
5. 🇪🇸 Spanish (es)
6. 🇵🇹 Portuguese (pt)
7. 🇷🇺 Russian (ru)
8. 🇯🇵 Japanese (ja)
9. 🇵🇱 Polish (pl)
10. 🇫🇷 French (fr)
11. 🇩🇪 German (de)
12. 🇮🇹 Italian (it)

## How to Implement Translations in Components

### Step 1: Import useLanguage Hook

```typescript
import { useLanguage } from '../contexts/LanguageContext';
```

### Step 2: Use the Hook in Component

```typescript
export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('page.section.title')}</h1>
      <p>{t('page.section.description')}</p>
    </div>
  );
}
```

### Step 3: Replace Hard-coded Text

**Before:**
```typescript
<h1>Free AI Hair Analysis</h1>
<p>Upload your photo and get a professional hair health report</p>
```

**After:**
```typescript
<h1>{t('tryFree.title')}</h1>
<p>{t('tryFree.subtitle')}</p>
```

## Pages That Need Translation Integration

### ✅ Completed Pages:
1. `/src/app/pages/Home.tsx` - Uses translations
2. `/src/app/pages/TryFreeAnalysis.tsx` - Partially integrated
3. `/src/app/components/Header.tsx` - Uses translations

### ⚠️ Pages Needing Translation:
1. `/src/app/pages/WhiteLabelHardware.tsx`
2. `/src/app/pages/APIServicesPage.tsx` (or ApiServices.tsx)
3. `/src/app/pages/SaaSPlatformPage.tsx` (or SaasPlatform.tsx)
4. `/src/app/pages/Implementation.tsx`
5. `/src/app/pages/Dashboard.tsx`
6. `/src/app/pages/NotFound.tsx`

## Translation File Structure

Each language file (`/src/app/locales/*.json`) should contain:

```json
{
  "nav": { ... },           // Navigation menu
  "home": { ... },          // Home page sections
  "tryFree": { ... },       // Try Free Analysis page
  "hardware": { ... },      // White Label Hardware page
  "api": { ... },           // API Services page
  "saas": { ... },          // SaaS Platform page
  "implementation": { ... },// Implementation page
  "dashboard": { ... },     // Dashboard page
  "notFound": { ... },      // 404 page
  "common": { ... }         // Common phrases
}
```

## Example: Translating a Page Component

### Original (Hard-coded):

```typescript
export default function HardwarePage() {
  return (
    <div>
      <h1>White Label Hardware Pricing</h1>
      <p>Professional hair analysis hardware</p>
      <button>View Pricing</button>
    </div>
  );
}
```

### Translated:

```typescript
import { useLanguage } from '../contexts/LanguageContext';

export default function HardwarePage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hardware.title')}</h1>
      <p>{t('hardware.subtitle')}</p>
      <button>{t('common.viewPricing')}</button>
    </div>
  );
}
```

## Testing Translations

1. **Switch Language**: Click the globe icon in header
2. **Check All Pages**: Navigate through all pages
3. **Verify Text**: Ensure all text changes to selected language
4. **Check Fallbacks**: Missing translations should fallback to English

## Next Steps

### Priority 1: Complete Translation Files
Create complete translation files for:
- ru.json (Russian)
- ja.json (Japanese)
- pl.json (Polish)
- fr.json (French)
- de.json (German)
- it.json (Italian)
- ko.json (Korean) - Update existing
- es.json (Spanish) - Update existing

### Priority 2: Update Page Components
For each page, add:
1. Import `useLanguage` hook
2. Extract `t` function
3. Replace all hard-coded text with `t('key.path')`

### Priority 3: Dynamic Content
For dynamic content like lists, create translation keys with parameters:

```typescript
// Translation file
{
  "hardware.products.single.title": "Single-Spectrum",
  "hardware.products.tri.title": "Tri-Spectrum"
}

// Component
const products = ['single', 'tri', 'triScreen'];
{products.map(product => (
  <h3>{t(`hardware.products.${product}.title`)}</h3>
))}
```

## Common Patterns

### 1. Lists/Arrays
```typescript
const concerns = [
  t('tryFree.questionnaire.hairLoss'),
  t('tryFree.questionnaire.dandruff'),
  t('tryFree.questionnaire.oily'),
];
```

### 2. Form Labels
```typescript
<label>{t('tryFree.questionnaire.age')}</label>
<option value="">{t('tryFree.questionnaire.selectAge')}</option>
```

### 3. Buttons/CTAs
```typescript
<button>{t('common.getStarted')}</button>
<button>{t('common.learnMore')}</button>
```

### 4. Navigation Links
```typescript
<Link to="/hardware">{t('nav.hardware')}</Link>
<Link to="/api">{t('nav.api')}</Link>
```

## Translation Key Naming Convention

- Use dot notation: `section.subsection.key`
- Be descriptive: `tryFree.upload.dragDrop` not `tryFree.text1`
- Group related keys: All questionnaire keys under `tryFree.questionnaire.*`
- Reuse common phrases: Use `common.*` for frequently used text

## Maintenance

### Adding New Text:
1. Add English version to `en.json`
2. Add translations to all other language files
3. Use `t('new.key')` in component

### Updating Existing Text:
1. Update in `en.json` first
2. Update in all other language files
3. No component changes needed

## Resources

- Language Context: `/src/app/contexts/LanguageContext.tsx`
- Translation Files: `/src/app/locales/*.json`
- Header Component: `/src/app/components/Header.tsx` (good example)
- Documentation: `/src/app/locales/README.md`
