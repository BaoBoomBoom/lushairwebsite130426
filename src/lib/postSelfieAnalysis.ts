import { signedSelfieApiUrl, uploadSelfieUrl } from '../config/api';

const DEFAULT_USER_ID = 'lusHair1829de25';
const DEFAULT_CUSTOMER = 'lusHair1829de25';
const DEFAULT_KEY =
  (import.meta.env.VITE_LUSHAIR_SIGN_KEY as string | undefined) || 'owvI0JMeIXsM';

export type SelfieAnalysisResult = {
  ok: boolean;
  status: number;
  body: unknown;
  error?: string;
};

export type SelfieUploadResult = {
  ok: boolean;
  status: number;
  body: unknown;
  imageUrl?: string;
  error?: string;
};

function toGenderCode(gender?: string): number {
  return gender === 'male' ? 1 : 2;
}

function safeJsonParse(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function normalizeImageUrl(value: string): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) {
    try {
      return new URL(value, 'https://tool.lushair.net').toString();
    } catch {
      return null;
    }
  }
  return null;
}

function collectCandidateUrls(payload: unknown, acc: string[] = []): string[] {
  if (typeof payload === 'string') {
    acc.push(payload);
    return acc;
  }
  if (Array.isArray(payload)) {
    payload.forEach((item) => collectCandidateUrls(item, acc));
    return acc;
  }
  if (!payload || typeof payload !== 'object') return acc;
  const obj = payload as Record<string, unknown>;
  const urlLikeKeys = ['imageUrl', 'url', 'imgUrl', 'fileUrl', 'path', 'src', 'location'];
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && urlLikeKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      acc.push(val);
      continue;
    }
    collectCandidateUrls(val, acc);
  }
  return acc;
}

function extractImageUrl(payload: unknown): string | null {
  const candidates = collectCandidateUrls(payload);
  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate);
    if (normalized) return normalized;
  }
  return null;
}

// MD5 for required request signature.
function md5(input: string): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function md5cycle(state: number[], block: number[]) {
    let [a, b, c, d] = state;
    a = ff(a, b, c, d, block[0], 7, -680876936);
    d = ff(d, a, b, c, block[1], 12, -389564586);
    c = ff(c, d, a, b, block[2], 17, 606105819);
    b = ff(b, c, d, a, block[3], 22, -1044525330);
    a = ff(a, b, c, d, block[4], 7, -176418897);
    d = ff(d, a, b, c, block[5], 12, 1200080426);
    c = ff(c, d, a, b, block[6], 17, -1473231341);
    b = ff(b, c, d, a, block[7], 22, -45705983);
    a = ff(a, b, c, d, block[8], 7, 1770035416);
    d = ff(d, a, b, c, block[9], 12, -1958414417);
    c = ff(c, d, a, b, block[10], 17, -42063);
    b = ff(b, c, d, a, block[11], 22, -1990404162);
    a = ff(a, b, c, d, block[12], 7, 1804603682);
    d = ff(d, a, b, c, block[13], 12, -40341101);
    c = ff(c, d, a, b, block[14], 17, -1502002290);
    b = ff(b, c, d, a, block[15], 22, 1236535329);
    a = gg(a, b, c, d, block[1], 5, -165796510);
    d = gg(d, a, b, c, block[6], 9, -1069501632);
    c = gg(c, d, a, b, block[11], 14, 643717713);
    b = gg(b, c, d, a, block[0], 20, -373897302);
    a = gg(a, b, c, d, block[5], 5, -701558691);
    d = gg(d, a, b, c, block[10], 9, 38016083);
    c = gg(c, d, a, b, block[15], 14, -660478335);
    b = gg(b, c, d, a, block[4], 20, -405537848);
    a = gg(a, b, c, d, block[9], 5, 568446438);
    d = gg(d, a, b, c, block[14], 9, -1019803690);
    c = gg(c, d, a, b, block[3], 14, -187363961);
    b = gg(b, c, d, a, block[8], 20, 1163531501);
    a = gg(a, b, c, d, block[13], 5, -1444681467);
    d = gg(d, a, b, c, block[2], 9, -51403784);
    c = gg(c, d, a, b, block[7], 14, 1735328473);
    b = gg(b, c, d, a, block[12], 20, -1926607734);
    a = hh(a, b, c, d, block[5], 4, -378558);
    d = hh(d, a, b, c, block[8], 11, -2022574463);
    c = hh(c, d, a, b, block[11], 16, 1839030562);
    b = hh(b, c, d, a, block[14], 23, -35309556);
    a = hh(a, b, c, d, block[1], 4, -1530992060);
    d = hh(d, a, b, c, block[4], 11, 1272893353);
    c = hh(c, d, a, b, block[7], 16, -155497632);
    b = hh(b, c, d, a, block[10], 23, -1094730640);
    a = hh(a, b, c, d, block[13], 4, 681279174);
    d = hh(d, a, b, c, block[0], 11, -358537222);
    c = hh(c, d, a, b, block[3], 16, -722521979);
    b = hh(b, c, d, a, block[6], 23, 76029189);
    a = hh(a, b, c, d, block[9], 4, -640364487);
    d = hh(d, a, b, c, block[12], 11, -421815835);
    c = hh(c, d, a, b, block[15], 16, 530742520);
    b = hh(b, c, d, a, block[2], 23, -995338651);
    a = ii(a, b, c, d, block[0], 6, -198630844);
    d = ii(d, a, b, c, block[7], 10, 1126891415);
    c = ii(c, d, a, b, block[14], 15, -1416354905);
    b = ii(b, c, d, a, block[5], 21, -57434055);
    a = ii(a, b, c, d, block[12], 6, 1700485571);
    d = ii(d, a, b, c, block[3], 10, -1894986606);
    c = ii(c, d, a, b, block[10], 15, -1051523);
    b = ii(b, c, d, a, block[1], 21, -2054922799);
    a = ii(a, b, c, d, block[8], 6, 1873313359);
    d = ii(d, a, b, c, block[15], 10, -30611744);
    c = ii(c, d, a, b, block[6], 15, -1560198380);
    b = ii(b, c, d, a, block[13], 21, 1309151649);
    a = ii(a, b, c, d, block[4], 6, -145523070);
    d = ii(d, a, b, c, block[11], 10, -1120210379);
    c = ii(c, d, a, b, block[2], 15, 718787259);
    b = ii(b, c, d, a, block[9], 21, -343485551);
    state[0] = add32(a, state[0]);
    state[1] = add32(b, state[1]);
    state[2] = add32(c, state[2]);
    state[3] = add32(d, state[3]);
  }
  function md5blk(str: string) {
    const out: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      out[i >> 2] =
        str.charCodeAt(i) +
        (str.charCodeAt(i + 1) << 8) +
        (str.charCodeAt(i + 2) << 16) +
        (str.charCodeAt(i + 3) << 24);
    }
    return out;
  }
  function md51(str: string) {
    const n = str.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i: number;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(str.substring(i - 64, i)));
    }
    const tail = new Array(16).fill(0);
    const s = str.substring(i - 64);
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (let j = 0; j < 16; j++) tail[j] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function hex(x: number[]) {
    const hexChars = '0123456789abcdef';
    let out = '';
    for (let i = 0; i < x.length; i++) {
      const v = x[i];
      out +=
        hexChars.charAt((v >> 4) & 0x0f) +
        hexChars.charAt(v & 0x0f) +
        hexChars.charAt((v >> 12) & 0x0f) +
        hexChars.charAt((v >> 8) & 0x0f) +
        hexChars.charAt((v >> 20) & 0x0f) +
        hexChars.charAt((v >> 16) & 0x0f) +
        hexChars.charAt((v >> 28) & 0x0f) +
        hexChars.charAt((v >> 24) & 0x0f);
    }
    return out;
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }
  return hex(md51(input));
}

/**
 * Upload selfie image first, then call `/selfieNetApi` with signed payload.
 */
export async function postSelfieAnalysis(
  imageFile: File,
  gender?: string
): Promise<SelfieAnalysisResult> {
  const uploaded = await uploadSelfieImage(imageFile);
  if (!uploaded.ok || !uploaded.imageUrl) {
    return {
      ok: false,
      status: uploaded.status,
      body: uploaded.body,
      error: uploaded.error || 'Failed to upload selfie image',
    };
  }

  return postSelfieByImageUrl(uploaded.imageUrl, gender);
}

export async function postSelfieByImageUrl(
  imageUrl: string,
  gender?: string
): Promise<SelfieAnalysisResult> {
  const genderCode = toGenderCode(gender);
  const sign = md5(`${genderCode}${imageUrl}${DEFAULT_KEY}${DEFAULT_CUSTOMER}`);
  const payload = {
    userId: DEFAULT_USER_ID,
    customer: DEFAULT_CUSTOMER,
    gender: genderCode,
    imageUrl,
    sign,
  };

  try {
    const res = await fetch(signedSelfieApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    const body = safeJsonParse(text);
    const bodyObj = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
    if (bodyObj?.success === false) {
      const codePart = bodyObj?.code !== undefined ? ` (${String(bodyObj.code)})` : '';
      const msg = typeof bodyObj?.msg === 'string' ? bodyObj.msg : 'server error';
      return { ok: false, status: res.status, body, error: `Signed selfieNetApi failed${codePart}: ${msg}` };
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, status: 0, body: null, error: msg };
  }
}

export async function uploadSelfieAndGetUrl(file: File, userId?: string): Promise<SelfieUploadResult> {
  const fd = new FormData();
  fd.append('userId', userId || DEFAULT_USER_ID);
  fd.append('file', file);
  try {
    const res = await fetch(uploadSelfieUrl(), {
      method: 'POST',
      body: fd,
    });
    const text = await res.text();
    const body = safeJsonParse(text);
    const bodyObj = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
    const bizSuccess = bodyObj?.success;
    const bizCode = bodyObj?.code;
    const bizMsg = typeof bodyObj?.msg === 'string' ? bodyObj.msg : null;
    const imageUrl = extractImageUrl(body) ?? undefined;

    if (bizSuccess === false) {
      const codePart = bizCode !== undefined ? ` (${String(bizCode)})` : '';
      return {
        ok: false,
        status: res.status,
        body,
        error: `Upload failed${codePart}: ${bizMsg || 'server error'}`,
      };
    }

    if (!res.ok) {
      return { ok: false, status: res.status, body, error: `Upload failed (${res.status})` };
    }
    if (!imageUrl) {
      return {
        ok: false,
        status: res.status,
        body,
        error: `Upload succeeded but imageUrl missing: ${JSON.stringify(body)}`,
      };
    }
    return { ok: true, status: res.status, body, imageUrl };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, status: 0, body: null, error: msg };
  }
}

async function uploadSelfieImage(file: File, userId?: string): Promise<SelfieUploadResult> {
  return uploadSelfieAndGetUrl(file, userId);
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
