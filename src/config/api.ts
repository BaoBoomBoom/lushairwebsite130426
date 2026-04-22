/** Base URL for Lushair APIs (no trailing slash). Override with VITE_LUSHAIR_API_BASE in .env */
export const LUSHAIR_API_BASE = (
  import.meta.env.VITE_LUSHAIR_API_BASE as string | undefined
)?.replace(/\/$/, '') || 'https://api.lushair.ai';
export const LUSHAIR_TOOL_API_BASE = 'https://tool.lushair.net/api/file';

export const SELFIE_API_PATH = '/file/selfieApi';
export const TRICHOSCOPE_API_PATH = '/file/trichoscopeApi';

export const HAIR_ANALYSIS_API_DOCS =
  'https://lushair.readme.io/docs/getting-started';

export function selfieApiUrl() {
  return `${LUSHAIR_API_BASE}${SELFIE_API_PATH}`;
}

export function uploadSelfieUrl() {
  return `${LUSHAIR_TOOL_API_BASE}/uploadSelfieNet`;
}

export function signedSelfieApiUrl() {
  return `${LUSHAIR_TOOL_API_BASE}/selfieNetApi`;
}

export function trichoscopeApiUrl() {
  return `${LUSHAIR_API_BASE}${TRICHOSCOPE_API_PATH}`;
}
