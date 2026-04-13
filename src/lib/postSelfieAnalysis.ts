import { selfieApiUrl } from '../config/api';

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, b64] = dataUrl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(b64 ?? '');
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

export type SelfieAnalysisResult = {
  ok: boolean;
  status: number;
  body: unknown;
  error?: string;
};

/**
 * POST multipart image to `file/selfieApi` (see VITE_LUSHAIR_API_BASE).
 * Server may require auth or CORS allowlist; callers should handle failures gracefully.
 */
export async function postSelfieAnalysis(
  imageDataUrl: string,
  meta: { age?: string; gender?: string }
): Promise<SelfieAnalysisResult> {
  const file = dataUrlToFile(imageDataUrl, 'selfie.jpg');
  const fd = new FormData();
  fd.append('file', file);
  if (meta.age) fd.append('age', meta.age);
  if (meta.gender) fd.append('gender', meta.gender);

  try {
    const res = await fetch(selfieApiUrl(), {
      method: 'POST',
      body: fd,
    });
    const text = await res.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, status: 0, body: null, error: msg };
  }
}

export function pickAnalysisPayload(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  const data = o.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return o;
}
