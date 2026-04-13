/** Base URL for Lushair APIs (no trailing slash). Override with VITE_LUSHAIR_API_BASE in .env */
export const LUSHAIR_API_BASE = (
  import.meta.env.VITE_LUSHAIR_API_BASE as string | undefined
)?.replace(/\/$/, '') || 'https://api.lushair.ai';

export const SELFIE_API_PATH = '/file/selfieApi';
export const TRICHOSCOPE_API_PATH = '/file/trichoscopeApi';

export const HAIR_ANALYSIS_API_DOCS =
  'https://s.apifox.cn/b5478188-d2e0-4ae7-bcc6-413f727d0081/api-295384578';

export function selfieApiUrl() {
  return `${LUSHAIR_API_BASE}${SELFIE_API_PATH}`;
}

export function trichoscopeApiUrl() {
  return `${LUSHAIR_API_BASE}${TRICHOSCOPE_API_PATH}`;
}
